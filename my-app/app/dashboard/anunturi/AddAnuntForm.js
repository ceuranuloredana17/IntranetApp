'use client'

import { useState, useTransition } from 'react'
import { addAnnouncement } from '@/app/actions/announcements'

export default function AddAnuntForm({ authorId }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    startTransition(async () => {
      const res = await addAnnouncement(formData, authorId)
      setResult(res)
      if (!res?.error) { e.target.reset(); setOpen(false) }
    })
  }

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + Adaugă anunț
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Anunț nou</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" required placeholder="Titlu anunț" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea name="content" required rows={3} placeholder="Conținut..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            {result?.error && <p className="text-red-600 text-sm">{result.error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={pending} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium">
                {pending ? 'Se publică...' : 'Publică'}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
