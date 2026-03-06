'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import { type Companion } from '@/lib/companions'
import { CreatePartnerModal } from './create-partner-modal'
import { TermsModal } from './terms-modal'

interface ProfileSetupProps {
  companions: Companion[]
  onSelect: (companion: Companion) => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function ProfileSetup({ companions, onSelect }: ProfileSetupProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCompanionForTerms, setSelectedCompanionForTerms] = useState<Companion | null>(null)

  const handleCreate = (c: Companion) => {
    setShowCreateModal(false)
    setSelectedCompanionForTerms(c)
  }

  const handleSelect = (c: Companion) => {
    setSelectedCompanionForTerms(c)
  }

  const handleAcceptTerms = () => {
    if (selectedCompanionForTerms) {
      onSelect(selectedCompanionForTerms)
      setSelectedCompanionForTerms(null)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-10 sm:px-6 sm:py-14"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-10"
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            <span className="text-primary">SolaceSync</span>
            <span className="font-mono text-muted-foreground">.AI</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:max-w-sm sm:text-sm">
            Choose your companion. Each brings a unique perspective, personality,
            and conversational style.
          </p>
        </motion.div>

        {/* Card Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {companions.map((c) => (
            <motion.button
              key={c.id}
              variants={card}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(c)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 sm:p-6"
            >
              {/* Initial + Name */}
              <div className={`mb-4 flex h-20 flex-col items-center justify-center rounded-lg ${c.accentBgSoft} sm:h-24`}>
                <span className={`text-2xl font-bold sm:text-3xl ${c.accentText}`}>
                  {c.name.charAt(0)}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground sm:text-xs">
                  {c.name}
                </span>
              </div>

              {/* Personality Word */}
              <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${c.accentText} ${c.accentBgSoft}`}>
                {c.personalityWord}
              </span>

              {/* Accent bar */}
              <div className={`mb-3 h-0.5 w-8 rounded-full ${c.accentBg} transition-all duration-300 group-hover:w-14`} />

              {/* Persona */}
              <h2 className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-card-foreground sm:text-base">
                {c.name}
                {c.gender === 'male' && <span className="text-blue-500 text-xs">♂</span>}
                {c.gender === 'female' && <span className="text-pink-500 text-xs">♀</span>}
                {c.gender === 'non-binary' && <span className="text-purple-500 text-xs">⚧</span>}
              </h2>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-primary sm:text-xs">
                {c.persona}
              </p>

              {/* Description */}
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {c.description}
              </p>

              {/* Traits */}
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {c.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground sm:px-2.5 sm:py-1 sm:text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:text-xs">
                Start conversation
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </motion.button>
          ))}

          {/* Create Custom Card */}
          <motion.button
            variants={card}
            whileHover={{ y: -4, transition: { duration: 0.18 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreateModal(true)}
            className="group flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-card/40 p-5 transition-all hover:border-primary/50 hover:bg-card/70 sm:p-6"
          >
            <Plus className="mb-1.5 h-7 w-7 text-muted-foreground transition-colors group-hover:text-primary sm:h-8 sm:w-8" />
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">
              Create Custom
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground/60 sm:text-[11px]">
              Build your own partner
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {showCreateModal && (
        <CreatePartnerModal
          onCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedCompanionForTerms && (
        <TermsModal
          onAccept={handleAcceptTerms}
          onClose={() => setSelectedCompanionForTerms(null)}
        />
      )}
    </>
  )
}
