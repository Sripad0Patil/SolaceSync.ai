import { useState, useCallback } from 'react'
import { type Companion } from '@/lib/companions'

interface ApiResponse {
  response: string
  timestamp: string
}

export function useChatAPI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (userMessage: string, companion: Companion): Promise<string | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_message: userMessage,
            personality_id: companion.id,
            companion_name: companion.name,
            system_prompt: companion.systemPrompt,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Request failed (${res.status})`)
        }

        const data: ApiResponse = await res.json()
        return data.response
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => setError(null), [])

  return { sendMessage, isLoading, error, clearError }
}
