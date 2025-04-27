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
};

export const analyzeFoodImage = async (image: File): Promise<FoodAnalysisResult> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(image);

    // In a real implementation, you would send this to OpenAI's API
    // For now, we'll return mock data after a delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // resolve(getMockAnalysis());
        resolve(getAnalysis(base64Image));
      }, 2000);
    });
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
        macros: { calories: 165, protein: 31, fat: 3.6, carbs: 0 }
      },
      {
        name: "Brown Rice",
        macros: { calories: 215, protein: 5, fat: 1.8, carbs: 45 }
      },
      {
        name: "Steamed Broccoli",
        macros: { calories: 55, protein: 3.7, fat: 0.6, carbs: 11 }
      },
      {
        name: "Olive Oil (1 tbsp)",
        macros: { calories: 119, protein: 0, fat: 13.5, carbs: 0 }
      }
    ],
    totalMacros: { calories: 554, protein: 39.7, fat: 19.5, carbs: 56 },
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
            { type: "input_text", text: "what's in this image?" },
            {
              type: "input_image",
              image_url: base64Image,
              detail: "high"
            },
          ],
        },
      ],
    });
    console.log(response.output_text);
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};
