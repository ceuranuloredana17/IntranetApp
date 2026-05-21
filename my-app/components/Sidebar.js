'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = {
  admin: [
    { href: '/dashboard', label: 'Panou principal', icon: '🏠' },
    { href: '/dashboard/utilizatori', label: 'Utilizatori', icon: '👥' },
    { href: '/dashboard/departamente', label: 'Departamente', icon: '🏢' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: '📢' },
    { href: '/dashboard/documente', label: 'Documente', icon: '📄' },
  ],
  hr: [
    { href: '/dashboard', label: 'Panou principal', icon: '🏠' },
    { href: '/dashboard/angajati', label: 'Angajați', icon: '👥' },
    { href: '/dashboard/cereri-concediu', label: 'Cereri concediu', icon: '🗓️' },
    { href: '/dashboard/documente', label: 'Documente HR', icon: '📄' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: '📢' },
  ],
  financiar: [
    { href: '/dashboard', label: 'Panou principal', icon: '🏠' },
    { href: '/dashboard/rapoarte', label: 'Rapoarte financiare', icon: '📊' },
    { href: '/dashboard/documente', label: 'Documente', icon: '📄' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: '📢' },
  ],
  manager: [
    { href: '/dashboard', label: 'Panou principal', icon: '🏠' },
    { href: '/dashboard/echipa', label: 'Echipa mea', icon: '👥' },
    { href: '/dashboard/taskuri', label: 'Taskuri', icon: '✅' },
    { href: '/dashboard/cereri-concediu', label: 'Cereri concediu', icon: '🗓️' },
    { href: '/dashboard/documente', label: 'Documente', icon: '📄' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: '📢' },
  ],
  angajat: [
    { href: '/dashboard', label: 'Panou principal', icon: '🏠' },
    { href: '/dashboard/taskuri-mele', label: 'Taskurile mele', icon: '✅' },
    { href: '/dashboard/cerere-concediu', label: 'Cerere concediu', icon: '🗓️' },
    { href: '/dashboard/documente', label: 'Documente', icon: '📄' },
    { href: '/dashboard/anunturi', label: 'Anunțuri', icon: '📢' },
  ],
}

const roleLabels = {
  admin: 'Administrator',
  hr: 'HR & Admin',
  financiar: 'Financiar',
  manager: 'Manager',
  angajat: 'Angajat',
}

export default function Sidebar({ role }) {
  const pathname = usePathname()
  const items = navItems[role] ?? navItems.angajat

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-lg">💼</div>
          <div>
            <div className="font-bold text-sm leading-tight">TechSoft</div>
            <div className="text-blue-300 text-xs">Intranet</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 mt-1">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-2">
          {roleLabels[role]}
        </span>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-blue-700 text-white font-medium'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-blue-800 text-xs text-blue-400 text-center">
        TechSoft Solutions SRL © 2026
      </div>
    </aside>
  )
}
