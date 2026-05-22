'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

const roleLabels = {
  admin: 'Administrator', hr: 'HR & Admin', financiar: 'Financiar',
  manager: 'Manager', angajat: 'Angajat',
}

const roleColors = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  hr: 'bg-purple-100 text-purple-700 border-purple-200',
  financiar: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  manager: 'bg-orange-100 text-orange-700 border-orange-200',
  angajat: 'bg-blue-100 text-blue-700 border-blue-200',
}

const avatarColors = {
  admin: 'bg-red-500', hr: 'bg-purple-500', financiar: 'bg-emerald-500',
  manager: 'bg-orange-500', angajat: 'bg-blue-500',
}

export default function TopBar({ user, unreadMessages = 0 }) {
  const [pending, startTransition] = useTransition()

  return (
    <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between shrink-0">
      {/* Left: date */}
      <div className="flex items-center gap-3">
        <div className="text-gray-500 text-sm capitalize">
          {new Date().toLocaleDateString('ro-RO', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </div>

      {/* Right: notifications + profile + logout */}
      <div className="flex items-center gap-3">
        {/* Messages bell */}
        <Link
          href="/dashboard/mesaje"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          title="Mesaje"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {unreadMessages > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${avatarColors[user.role]}`}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium border ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => startTransition(() => logout())}
          disabled={pending}
          title="Ieșire"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  )
}
