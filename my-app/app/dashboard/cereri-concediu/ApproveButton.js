'use client'

import { useTransition } from 'react'
import { reviewLeaveRequest } from '@/app/actions/leave'

export default function ApproveButton({ requestId, reviewerId }) {
  const [pending, startTransition] = useTransition()

  function handle(status) {
    startTransition(() => reviewLeaveRequest(requestId, reviewerId, status))
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle('approved')}
        disabled={pending}
        className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
      >
        Aprobă
      </button>
      <button
        onClick={() => handle('rejected')}
        disabled={pending}
        className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
      >
        Respinge
      </button>
    </div>
  )
}
