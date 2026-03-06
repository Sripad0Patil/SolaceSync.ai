'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TermsModalProps {
    onAccept: () => void
    onClose: () => void
}

export function TermsModal({ onAccept, onClose }: TermsModalProps) {
    const [agreed, setAgreed] = useState(false)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg p-6 overflow-hidden border shadow-2xl bg-card border-border rounded-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute p-2 transition-colors rounded-full top-4 right-4 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="mb-2 text-xl font-bold text-foreground">SolaceSync.AI Terms & Conditions</h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Please review the following conditions before proceeding to the chat interface.
                    </p>

                    <div className="p-4 space-y-4 text-sm rounded-lg bg-secondary/50 text-secondary-foreground">
                        <ol className="pl-5 space-y-3 list-decimal">
                            <li>
                                <strong>Not a Real Person:</strong> This is an AI. Do not form emotional attachments.
                            </li>
                            <li>
                                <strong>Respectful Communication:</strong> Keep interactions respectful and avoid overly vulgar language. This platform is meant for connection and care.
                            </li>
                            <li>
                                <strong>No Data Retention:</strong> We don't keep your chat history. Once you leave the chat, you cannot continue again—everything is gone indefinitely!
                            </li>
                        </ol>
                    </div>

                    <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 border rounded bg-background border-border group-hover:border-primary shrink-0">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {agreed && (
                                <svg className="w-3 h-3 text-primary" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm font-medium select-none text-foreground group-hover:text-primary">
                            I am agreeing to the above conditions
                        </span>
                    </label>

                    <div className="flex gap-3 mt-8">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="flex-1" disabled={!agreed} onClick={onAccept}>
                            Continue
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
