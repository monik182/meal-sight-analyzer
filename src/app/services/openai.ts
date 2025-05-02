import { FoodAnalysisResult, UserProfile } from '@/types'
import { fileToBase64 } from '@/util'

export const analyzeFoodImage = async (image: File): Promise<FoodAnalysisResult> => {
  try {
    const base64Image = await fileToBase64(image)

    return getAnalysis(base64Image)
  } catch (error) {
    console.error("Error analyzing food image:", error)
    throw new Error("Failed to analyze food image")
  }
}

const getAnalysis = async (base64Image: string): Promise<FoodAnalysisResult> => {
  try {
    const response = await fetch('/api/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ content: base64Image }] }),
    });
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error analyzing food image:", error)
    throw new Error("Failed to analyze food image")
  }
}

export const generateDietaryRecommendations = async (
  foodAnalysis: FoodAnalysisResult,
  userProfile?: UserProfile
): Promise<string[]> => {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ foodAnalysis, userProfile }),
    });
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return ["Unable to generate personalized recommendations at this time."]
  }
}
