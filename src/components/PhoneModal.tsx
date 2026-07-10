'use client'

import { useState } from 'react'

interface PhoneModalProps {
  onSave: (phone: string) => void
}

export default function PhoneModal({ onSave }: PhoneModalProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter your phone number.')
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-ink)]/70">
      <div className="w-full max-w-sm bg-[var(--cream)] rounded-t-2xl sm:rounded-sm p-8 border-t-4 border-[var(--gold)]">
        <p className="font-serif text-2xl font-bold text-[var(--body-text)] leading-tight">
          Save your postcards
        </p>
        <p className="font-serif text-sm text-[var(--navy-mid)] mt-2 leading-relaxed">
          Enter your number once. Your postmarks can be restored later if a backend is enabled.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="tel"
            value={value}
            onChange={e => { setValue(e.target.value); setError('') }}
            placeholder="(732) 000-0000"
            autoFocus
            className="w-full px-4 py-3 font-mono text-sm bg-white border-2 border-[var(--navy)]/30 rounded-sm text-[var(--body-text)] placeholder-[var(--navy-mid)]/40 focus:outline-none focus:border-[var(--navy)]"
          />
          {error && (
            <p className="font-mono text-xs text-[var(--gold)] mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full py-4 bg-[var(--navy)] text-[var(--cream)] font-mono text-sm tracking-widest uppercase rounded-sm shadow-[3px_3px_0_var(--gold)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--gold)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_var(--gold)] transition-all"
          >
            Save My Postcards
          </button>
          <p className="font-mono text-[10px] text-[var(--navy-mid)] opacity-40 mt-4 text-center">
            PLACEHOLDER_PHONE_SAVE_PRIVACY_COPY
          </p>
        </form>
      </div>
    </div>
  )
}
