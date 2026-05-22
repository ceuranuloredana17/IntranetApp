'use client'

import { useTransition } from 'react'
import { submitForApproval, approveDocument, rejectDocument, deleteDocument } from '@/app/actions/documents'

export default function DocumentActions({ doc, sessionId, sessionRole }) {
  const [pending, startTransition] = useTransition()
  const canApprove = ['admin', 'hr', 'manager'].includes(sessionRole)
  const isOwner = doc.created_by === sessionId
  const isAdmin = sessionRole === 'admin'

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Owner can submit draft for approval */}
      {doc.status === 'draft' && isOwner && (
        <button
          onClick={() => startTransition(() => submitForApproval(doc.id))}
          disabled={pending}
          className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 whitespace-nowrap"
        >
          Trimite spre avizare
        </button>
      )}

      {/* Approver can approve/reject pending docs */}
      {doc.status === 'pending' && canApprove && (
        <>
          <button
            onClick={() => startTransition(() => approveDocument(doc.id))}
            disabled={pending}
            className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            Avizează
          </button>
          <button
            onClick={() => startTransition(() => rejectDocument(doc.id))}
            disabled={pending}
            className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
          >
            Respinge
          </button>
        </>
      )}

      {/* Owner or admin can delete draft */}
      {(doc.status === 'draft' && isOwner) || isAdmin ? (
        <button
          onClick={() => startTransition(() => deleteDocument(doc.id))}
          disabled={pending}
          className="text-xs px-2 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
          title="Șterge"
        >
          🗑
        </button>
      ) : null}
    </div>
  )
}
