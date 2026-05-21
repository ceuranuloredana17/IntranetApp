'use client'

import { useTransition } from 'react'
import { updateTaskStatus } from '@/app/actions/tasks'

const nextStatus = { pending: 'in_progress', in_progress: 'done' }
const nextLabel = { pending: 'Începe', in_progress: 'Marchează finalizat' }

export default function StatusButton({ taskId, currentStatus }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => updateTaskStatus(taskId, nextStatus[currentStatus]))}
      disabled={pending}
      className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg whitespace-nowrap"
    >
      {pending ? '...' : nextLabel[currentStatus]}
    </button>
  )
}
