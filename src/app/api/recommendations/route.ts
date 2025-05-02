import { generateRecommendationsWithAI } from '@/app/api/services/openai'

export async function POST(request: Request) {
  const data = await request.json()

  if (!data?.foodAnalysis) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const result = await generateRecommendationsWithAI(data.foodAnalysis, data.userProfile)
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return new Response(JSON.stringify({ message: 'Error generating recommendations', ok: false }), { status: 500 })
  }
}
