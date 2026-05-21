'use client'

import { useTransition } from 'react'
import { logout } from '@/app/actions/auth'

const roleLabels = {
  admin: 'Administrator',
  hr: 'HR & Admin',
  financiar: 'Financiar',
  manager: 'Manager',
  angajat: 'Angajat',
}

const roleColors = {
  admin: 'bg-red-100 text-red-700',
  hr: 'bg-purple-100 text-purple-700',
  financiar: 'bg-green-100 text-green-700',
  manager: 'bg-orange-100 text-orange-700',
  angajat: 'bg-blue-100 text-blue-700',
}

export default function TopBar({ user }) {
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(() => logout())
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
            {roleLabels[user.role]}
          </span>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          {pending ? '...' : 'Ieșire'}
        </button>
      </div>
    </header>
  )
}
