'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ProfileSetup } from '@/components/profile-setup'
import { ChatInterface } from '@/components/chat-interface'
import { COMPANIONS, type Companion } from '@/lib/companions'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)

  return (
    <>
      {/* Theme toggle on profile setup page */}
      {!selectedCompanion && (
        <div className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!selectedCompanion ? (
          <ProfileSetup
            key="setup"
            companions={COMPANIONS}
            onSelect={setSelectedCompanion}
          />
        ) : (
          <ChatInterface
            key={selectedCompanion.id}
            companion={selectedCompanion}
            onBack={() => setSelectedCompanion(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
