'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = {
  admin: [
    { href: '/dashboard', label: 'Panou principal', icon: 'home' },
    { href: '/dashboard/utilizatori', label: 'Utilizatori', icon: 'users' },
    { href: '/dashboard/departamente', label: 'Departamente', icon: 'building' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: 'megaphone' },
    { href: '/dashboard/documente', label: 'Documente', icon: 'document' },
    { href: '/dashboard/mesaje', label: 'Mesaje', icon: 'mail', badge: true },
  ],
  hr: [
    { href: '/dashboard', label: 'Panou principal', icon: 'home' },
    { href: '/dashboard/angajati', label: 'Angajați', icon: 'users' },
    { href: '/dashboard/cereri-concediu', label: 'Cereri concediu', icon: 'calendar' },
    { href: '/dashboard/documente', label: 'Documente HR', icon: 'document' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: 'megaphone' },
    { href: '/dashboard/mesaje', label: 'Mesaje', icon: 'mail', badge: true },
  ],
  financiar: [
    { href: '/dashboard', label: 'Panou principal', icon: 'home' },
    { href: '/dashboard/rapoarte', label: 'Rapoarte', icon: 'chart' },
    { href: '/dashboard/documente', label: 'Documente', icon: 'document' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: 'megaphone' },
    { href: '/dashboard/mesaje', label: 'Mesaje', icon: 'mail', badge: true },
  ],
  manager: [
    { href: '/dashboard', label: 'Panou principal', icon: 'home' },
    { href: '/dashboard/echipa', label: 'Echipa mea', icon: 'users' },
    { href: '/dashboard/taskuri', label: 'Taskuri', icon: 'check' },
    { href: '/dashboard/cereri-concediu', label: 'Cereri concediu', icon: 'calendar' },
    { href: '/dashboard/documente', label: 'Documente', icon: 'document' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: 'megaphone' },
    { href: '/dashboard/mesaje', label: 'Mesaje', icon: 'mail', badge: true },
  ],
  angajat: [
    { href: '/dashboard', label: 'Panou principal', icon: 'home' },
    { href: '/dashboard/taskuri-mele', label: 'Taskurile mele', icon: 'check' },
    { href: '/dashboard/cerere-concediu', label: 'Cerere concediu', icon: 'calendar' },
    { href: '/dashboard/documente', label: 'Documente', icon: 'document' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: 'megaphone' },
    { href: '/dashboard/mesaje', label: 'Mesaje', icon: 'mail', badge: true },
  ],
}

const roleLabels = {
  admin: 'Administrator', hr: 'HR & Admin', financiar: 'Financiar',
  manager: 'Manager', angajat: 'Angajat',
}

const icons = {
  home: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  users: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  building: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  megaphone: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  document: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  mail: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  check: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
}

export default function Sidebar({ role, unreadMessages = 0 }) {
  const pathname = usePathname()
  const items = navItems[role] ?? navItems.angajat

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">TechSoft</p>
            <p className="text-gray-500 text-xs">Intranet</p>
          </div>
        </div>
      </div>

      {/* Role label */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {roleLabels[role]}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {items.map(item => {
          const active = pathname === item.href
          const showBadge = item.badge && unreadMessages > 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {icons[item.icon]}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {showBadge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shrink-0">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-800">
        <p className="text-[10px] text-gray-600 text-center">TechSoft Solutions SRL · 2026</p>
      </div>
    </aside>
  )
}
