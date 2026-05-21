'use client'

import { useActionState } from 'react'
import { submitLeaveRequest } from '@/app/actions/leave'

export default function CerereConcediuPage() {
  const [state, action, pending] = useActionState(submitLeaveRequest, undefined)

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cerere de Concediu</h1>
        <p className="text-gray-500 text-sm">Completați formularul pentru a solicita concediu.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data început</label>
            <input
              type="date"
              name="start_date"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data sfârșit</label>
            <input
              type="date"
              name="end_date"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motiv (opțional)</label>
            <textarea
              name="reason"
              rows={3}
              placeholder="Ex: Concediu medical, eveniment personal..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
            />
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {state.success}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {pending ? 'Se trimite...' : 'Trimite cererea'}
          </button>
        </form>
      </div>
    </div>
  )
}
