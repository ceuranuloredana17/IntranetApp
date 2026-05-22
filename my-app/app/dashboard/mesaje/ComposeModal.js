'use client'

import { useState, useActionState } from 'react'
import { sendMessage } from '@/app/actions/messages'

const roleLabels = {
  admin: 'Administrator', hr: 'HR', financiar: 'Financiar',
  manager: 'Manager', angajat: 'Angajat',
}

export default function ComposeModal({ users }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(sendMessage, undefined)

  if (state?.success && open) setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
      >
        ✏️ Mesaj nou
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Mesaj nou</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form action={action} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinatar *</label>
                <select
                  name="recipient_id"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectează destinatarul...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {roleLabels[u.role]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subiect *</label>
                <input
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj *</label>
                <textarea
                  name="content"
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium"
                >
                  {pending ? 'Se trimite...' : '✉️ Trimite'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
