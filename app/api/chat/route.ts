import { NextRequest, NextResponse } from 'next/server'

// ---- In-memory conversation history (per personality) ----
const histories = new Map<string, { role: string; content: string }[]>()

const MAX_HISTORY = 20 // keep last 20 messages = 10 exchanges

interface ChatBody {
  user_message: string
  personality_id: string
  companion_name: string
  system_prompt: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatBody = await req.json()
    const { user_message, personality_id, system_prompt } = body

    if (!user_message?.trim()) {
      return NextResponse.json({ error: 'Message is empty' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Retrieve or create history
    if (!histories.has(personality_id)) {
      histories.set(personality_id, [])
    }
    const history = histories.get(personality_id)!

    // Build messages array
    const messages = [
      { role: 'system', content: system_prompt },
      ...history.slice(-MAX_HISTORY),
      { role: 'user', content: user_message.trim() },
    ]

    // Call Groq API directly
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.8,
        max_tokens: 512,
        top_p: 0.9,
      }),
    })

    if (!groqRes.ok) {
      const errBody = await groqRes.text()
      console.error('[v0] Groq API error:', groqRes.status, errBody)
      return NextResponse.json(
        { error: `Groq API error: ${groqRes.status}` },
        { status: 502 }
      )
    }

    const data = await groqRes.json()
    const reply: string = data.choices?.[0]?.message?.content ?? ''

    // Store in history
    history.push({ role: 'user', content: user_message.trim() })
    history.push({ role: 'assistant', content: reply })

    // Trim if too long
    while (history.length > 50) {
      history.shift()
    }

    return NextResponse.json({
      response: reply,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[v0] /api/chat error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
