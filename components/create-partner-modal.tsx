'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ACCENT_OPTIONS, PERSONALITY_WORDS, type Companion } from '@/lib/companions'

interface CreatePartnerModalProps {
  onCreate: (companion: Companion) => void
  onClose: () => void
}

export function CreatePartnerModal({ onCreate, onClose }: CreatePartnerModalProps) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('female')
  const [persona, setPersona] = useState('')
  const [personalityWord, setPersonalityWord] = useState<string>(PERSONALITY_WORDS[0])
  const [description, setDescription] = useState('')
  const [accentIdx, setAccentIdx] = useState(0)
  const [traits, setTraits] = useState<string[]>([])
  const [traitInput, setTraitInput] = useState('')

  const accent = ACCENT_OPTIONS[accentIdx]

  const addTrait = () => {
    const val = traitInput.trim()
    if (val && traits.length < 3) {
      setTraits((p) => [...p, val])
      setTraitInput('')
    }
  }

  const submit = () => {
    if (!name.trim() || !persona.trim() || traits.length === 0) return

    const c: Companion = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      gender,
      persona: persona.trim(),
      personalityWord,
      description: description.trim() || 'A unique companion created just for you.',
      traits,
      accentBg: accent.bg,
      accentText: accent.text,
      accentBgSoft: accent.soft,
      systemPrompt: `You are ${name}, ${persona}. Personality traits: ${traits.join(', ')}. You are ${personalityWord}. ${description}. Be authentic and conversational. Keep responses under 3 sentences unless asked for more.`,
      greeting: `Hey! I'm ${name}. Really glad you're here -- what's on your mind today?`,
      isCustom: true,
    }
    onCreate(c)
  }

  const isValid = name.trim() && persona.trim() && traits.length > 0

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      >
        {/* Modal */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:right-4 sm:top-4"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-bold text-foreground sm:text-xl">Create Your Partner</h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Customize a unique AI companion
          </p>

          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {/* Name */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex, River..."
                maxLength={20}
                className="mt-1.5 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </fieldset>

            {/* Gender */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">Gender</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'male', symbol: '♂', label: 'Male', activeClass: 'bg-blue-500 border-blue-500 text-white shadow-blue-500/30' },
                    { value: 'female', symbol: '♀', label: 'Female', activeClass: 'bg-pink-500 border-pink-500 text-white shadow-pink-500/30' },
                    { value: 'non-binary', symbol: '⚧', label: 'Non-Binary', activeClass: 'bg-purple-500 border-purple-500 text-white shadow-purple-500/30' },
                  ] as const
                ).map(({ value, symbol, label, activeClass }) => {
                  const isSelected = gender === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setGender(value)}
                      className={`relative flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 text-xs font-semibold transition-all duration-200 select-none
                        ${isSelected
                          ? `${activeClass} scale-[1.04] shadow-lg`
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground hover:scale-[1.02]'
                        }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black leading-none shadow">
                          ✓
                        </span>
                      )}
                      <span className="text-lg leading-none">{symbol}</span>
                      <span className="text-[10px] sm:text-xs">{label}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Persona */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">Persona</label>
              <input
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="e.g., The Creative Dreamer..."
                maxLength={30}
                className="mt-1.5 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </fieldset>

            {/* Personality Word */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">
                Personality Word
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5 sm:gap-2">
                {PERSONALITY_WORDS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPersonalityWord(w)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors sm:text-xs ${personalityWord === w
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                      }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Description */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe personality and style..."
                maxLength={150}
                rows={2}
                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
                {description.length}/150
              </p>
            </fieldset>

            {/* Color */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">
                Color Theme
              </label>
              <div className="mt-1.5 grid grid-cols-8 gap-2">
                {ACCENT_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAccentIdx(i)}
                    className={`h-8 w-full rounded-md ${opt.bg} transition-all sm:h-9 ${accentIdx === i
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                      : 'opacity-50 hover:opacity-80'
                      }`}
                    aria-label={opt.label}
                  />
                ))}
              </div>
            </fieldset>

            {/* Traits */}
            <fieldset>
              <label className="text-xs font-semibold text-foreground sm:text-sm">
                Traits <span className="font-normal text-muted-foreground">(up to 3)</span>
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={traitInput}
                  onChange={(e) => setTraitInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTrait()}
                  placeholder="e.g., Witty"
                  maxLength={15}
                  disabled={traits.length >= 3}
                  className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={addTrait}
                  disabled={traits.length >= 3 || !traitInput.trim()}
                  className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  Add
                </button>
              </div>
              {traits.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {traits.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground sm:text-xs"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTraits((p) => p.filter((x) => x !== t))}
                        className="opacity-60 hover:opacity-100"
                        aria-label={`Remove ${t}`}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </fieldset>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!isValid}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 sm:text-sm"
            >
              Create Partner
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
