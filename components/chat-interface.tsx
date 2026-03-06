'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { type Companion } from '@/lib/companions'
import { useChatAPI } from '@/lib/use-chat-api'

interface Message {
  id: string
  sender: 'user' | 'companion'
  text: string
}

interface ChatInterfaceProps {
  companion: Companion
  onBack: () => void
}

export function ChatInterface({ companion, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'companion', text: companion.greeting },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isLoading, error, clearError } = useChatAPI()

  // Auto-scroll on new message or typing indicator
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    clearError()

    const reply = await sendMessage(trimmed, companion)

    if (reply) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'companion', text: reply },
      ])
    } else {
      // Show error inline in the chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'companion',
          text: "Hmm, I couldn't connect right now. Try sending that again?",
        },
      ])
    }

    setIsTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[100dvh] flex-col bg-background"
    >
      {/* -------- Header -------- */}
      <header className="safe-top flex shrink-0 items-center justify-between border-b border-border bg-card px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Avatar badge */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm ${companion.accentBg}`}
          >
            {companion.name.charAt(0).toUpperCase()}
          </div>

          {/* Name + status */}
          <div className="min-w-0">
            <h2 className="flex items-center gap-1.5 truncate text-sm font-semibold text-card-foreground sm:text-base">
              {companion.name}
              {companion.gender === 'male' && <span className="text-blue-500 text-xs">♂</span>}
              {companion.gender === 'female' && <span className="text-pink-500 text-xs">♀</span>}
              {companion.gender === 'non-binary' && <span className="text-purple-500 text-xs">⚧</span>}
            </h2>
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.p
                  key="typing"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="text-[10px] font-medium text-primary sm:text-xs"
                >
                  Thinking...
                </motion.p>
              ) : (
                <motion.p
                  key="persona"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="truncate text-[10px] text-muted-foreground sm:text-xs"
                >
                  {companion.persona}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* -------- Error banner -------- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-destructive/20 bg-destructive/10 text-destructive"
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs sm:px-5 sm:text-sm">
              <span className="truncate">{error}</span>
              <button
                onClick={clearError}
                className="ml-2 shrink-0 underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- Messages -------- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Companion avatar on left */}
                {msg.sender === 'companion' && (
                  <div
                    className={`mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white sm:h-7 sm:w-7 sm:text-[10px] ${companion.accentBg}`}
                  >
                    {companion.name.charAt(0)}
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed sm:max-w-[75%] sm:px-4 sm:py-3 sm:text-sm ${msg.sender === 'user'
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm border border-border bg-card text-card-foreground'
                    }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing dots */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex justify-start"
              >
                <div
                  className={`mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white sm:h-7 sm:w-7 sm:text-[10px] ${companion.accentBg}`}
                >
                  {companion.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* -------- Input -------- */}
      <footer className="safe-bottom shrink-0 border-t border-border bg-card px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-w-0 flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 sm:px-4 sm:py-2.5"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 sm:h-10 sm:w-10"
            aria-label="Send message"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </footer>
    </motion.div>
  )
}
