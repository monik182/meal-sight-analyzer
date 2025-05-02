import { mealAnalysisPromptText, getRecommendationsPromptText } from '@/prompts'
import { FoodAnalysisResult, UserProfile } from '@/types'
import OpenAI from 'openai'

export const analyzeImageWithAI = async (base64Image: string): Promise<FoodAnalysisResult> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

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
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

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
