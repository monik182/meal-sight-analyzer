import { mealAnalysisPromptText, getRecommendationsPromptText } from '@/prompts'
import { FoodAnalysisResult, UserProfile } from '@/types'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const isImageSafe = async (base64Image: string): Promise<{ isSafe: boolean, categories: string[] }> => {
  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: [
        { type: "text", text: "The user uploaded an image." },
        {
          type: "image_url",
          image_url: {
            url: base64Image
          }
        }
      ],
    });

    const categories = moderation.results[0].categories;
    const flaggedCategories = Object.keys(categories).filter(category => categories[category]);
    return { isSafe: !moderation.results[0].flagged, categories: flaggedCategories }

  } catch (error) {
    console.error("Error moderating image:", error)
    return { isSafe: false, categories: [] }
  }
}

export const analyzeImageWithAI = async (base64Image: string): Promise<FoodAnalysisResult> => {
  const { isSafe, categories } = await isImageSafe(base64Image)
  if (!isSafe) {
    const error = new Error("Image contains flagged content: " + categories.join(", "));
    error.name = "UnsafeContentError";
    throw error;
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: mealAnalysisPromptText },
            {
              type: "input_image",
              image_url: base64Image,
              detail: "high"
            },
          ],
        },
      ],
      temperature: 0.7,
    })

    try {
      return JSON.parse(response.output_text) as FoodAnalysisResult
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return {
        "foodItems": [],
        "totalMacros": { calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0 },
        "confidenceLevel": "Low"
      }
    }
  } catch (error) {
    console.error("Error analyzing food image:", error)
    throw new Error("Failed to analyze food image")
  }
}

export const generateRecommendationsWithAI = async (
  foodAnalysis: FoodAnalysisResult,
  userProfile?: UserProfile
): Promise<string[]> => {
  try {

    // Format food items and prepare prompt
    const foodItemsText = foodAnalysis.foodItems
      .map(item => `${item.name}: ${item.macros.calories} calories...`)
      .join('\n')

    const totalMacrosText = `Total: ${foodAnalysis.totalMacros.calories} calories...`
    const userContext = userProfile ? `Additional user context...` : ''
    const promptText = getRecommendationsPromptText(foodItemsText, totalMacrosText, foodAnalysis, userContext)

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    // Parse and return recommendations
    const resultText = response.choices[0]?.message?.content || '{"recommendations":[]}'
    const parsedResponse = JSON.parse(resultText)

    if (Array.isArray(parsedResponse)) return parsedResponse
    if (Array.isArray(parsedResponse.recommendations)) return parsedResponse.recommendations
    return []
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return ["Unable to generate personalized recommendations at this time."]
  }
}
