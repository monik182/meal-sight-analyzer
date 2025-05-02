import { analyzeImageWithAI } from '../services/openai'
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.messages) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const result = await analyzeImageWithAI(data.messages[0].content)
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error("Error analyzing food image:", error);
    return new Response(JSON.stringify({ message: 'Error analyzing image', ok: false }), { status: 500 })
  }
}
