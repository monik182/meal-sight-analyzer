import { getRecommendationsPromptText, mealAnalysisPromptText } from '@/prompts';
import { FoodAnalysisResult, UserProfile } from '@/types';
import { fileToBase64 } from '@/util';
import OpenAI from 'openai'

export const analyzeFoodImage = async (image: File): Promise<FoodAnalysisResult> => {
  try {
    const base64Image = await fileToBase64(image);

    return getAnalysis(base64Image)
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};

// Mock data for development
const getMockAnalysis = (): FoodAnalysisResult => {
  return {
    foodItems: [
      {
        name: "Grilled Chicken Breast",
        macros: { calories: 165, protein: 31, fat: 3.6, carbs: 0, sugar: 0 }
      },
      {
        name: "Brown Rice",
        macros: { calories: 215, protein: 5, fat: 1.8, carbs: 45, sugar: 0 }
      },
      {
        name: "Steamed Broccoli",
        macros: { calories: 55, protein: 3.7, fat: 0.6, carbs: 11, sugar: 2 }
      },
      {
        name: "Olive Oil (1 tbsp)",
        macros: { calories: 119, protein: 0, fat: 13.5, carbs: 0, sugar: 0 }
      }
    ],
    totalMacros: { calories: 554, protein: 39.7, fat: 19.5, carbs: 56, sugar: 2 },
    confidenceLevel: "High"
  };
};

const getAnalysis = async (base64Image: string): Promise<FoodAnalysisResult> => {
  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

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
    });

    try {
      // console.log(response.output_text);
      return JSON.parse(response.output_text) as FoodAnalysisResult;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {
        "foodItems": [],
        "totalMacros": { "calories": 0, "protein": 0, "fat": 0, "carbs": 0, "sugar": 0 },
        "confidenceLevel": "Low"
      }
    }
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};

export const generateDietaryRecommendations = async (
  foodAnalysis: FoodAnalysisResult,
  userProfile?: UserProfile
): Promise<string[]> => {
  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const foodItemsText = foodAnalysis.foodItems
      .map(item => `${item.name}: ${item.macros.calories} calories, ${item.macros.protein}g protein, ${item.macros.fat}g fat, ${item.macros.carbs}g carbs, ${item.macros.sugar}g sugar`)
      .join('\n');

    const totalMacrosText = `Total: ${foodAnalysis.totalMacros.calories} calories, ${foodAnalysis.totalMacros.protein}g protein, ${foodAnalysis.totalMacros.fat}g fat, ${foodAnalysis.totalMacros.carbs}g carbs, ${foodAnalysis.totalMacros.sugar}g sugar`;

    const userContext = userProfile ? `
Additional user context:
- Goal: ${userProfile.goal}
- Activity level: ${userProfile.activityLevel}
- Dietary restrictions: ${userProfile.dietaryRestrictions.join(", ")}
- Health conditions: ${userProfile.healthConditions.join(", ")}
    ` : '';

    const promptText = getRecommendationsPromptText(foodItemsText, totalMacrosText, foodAnalysis, userContext);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: promptText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const resultText = response.choices[0]?.message?.content || '{"recommendations":[]}';
    // console.log(resultText);
    const parsedResponse = JSON.parse(resultText);

    if (Array.isArray(parsedResponse)) {
      return parsedResponse;
    }

    if (Array.isArray(parsedResponse.recommendations)) {
      return parsedResponse.recommendations;
    }

    return [];
  } catch (error) {
    console.error("Error generating dietary recommendations:", error);
    return [
      "Unable to generate personalized recommendations at this time.",
      "Consider consulting with a nutrition professional for dietary advice."
    ];
  }
};
