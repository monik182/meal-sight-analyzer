import OpenAI from 'openai'

export type FoodAnalysisResult = {
  foodItems: FoodItem[];
  totalMacros: Macros;
  confidenceLevel: 'Low' | 'Medium' | 'High';
};

export type FoodItem = {
  name: string;
  macros: Macros;
};

export type Macros = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
};

export const analyzeFoodImage = async (image: File): Promise<FoodAnalysisResult> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(image);

    return getAnalysis(base64Image)
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
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

const getAnalysis = async (base64Image: string): Promise<FoodAnalysisResult | string> => {
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
            { type: "input_text", text: promptText },
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
      console.log(response.output_text);
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


const promptText = `
You are a nutrition analysis system that can identify food from images and provide detailed macro information.

TASK:
1. Analyze the provided image.
2. Determine if the image contains food/meal. If not, respond with a default "Not a food image" result.
3. If it is food, identify each distinct food item visible in the image.
4. For each food item, estimate the approximate portion size and its macro nutrient content: calories, protein, fat, and carbs.
5. Calculate the total macro nutrients for the entire meal.
6. Provide a confidence level based on image clarity and your ability to identify items accurately.

YOUR RESPONSE MUST BE VALID JSON in the following format with no additional text:
{
  "foodItems": [
    {
      "name": "Item Name",
      "macros": { "calories": number, "protein": number, "fat": number, "carbs": number, "sugar": number }
    }
    // Additional food items...
  ],
  "totalMacros": { "calories": number, "protein": number, "fat": number, "carbs": number, "sugar": number },
  "confidenceLevel": "Low" | "Medium" | "High"
}

IMPORTANT RULES:
- Provide numerical values only for macros (no units)
- Round all values to one decimal place
- If you cannot identify food in the image, return:
  {
    "foodItems": [],
    "totalMacros": {"calories": 0, "protein": 0, "fat": 0, "carbs": 0, "sugar": 0},
    "confidenceLevel": "Low"
  }
- Base confidence levels on:
  * "Low": Poor image quality or unusual/hard to identify foods
  * "Medium": Standard food items with some uncertainty about quantities
  * "High": Clear image with easily identifiable standard foods
`;
