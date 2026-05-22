import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await requireSession()
  const db = getDb()

  const announcements = db.prepare(`
    SELECT a.*, u.name as author_name
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 4
  `).all()

  const stats = {
    users: db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt,
    departments: db.prepare('SELECT COUNT(*) as cnt FROM departments').get().cnt,
    pendingLeave: db.prepare("SELECT COUNT(*) as cnt FROM leave_requests WHERE status = 'pending'").get().cnt,
    documents: db.prepare("SELECT COUNT(*) as cnt FROM documents WHERE status = 'approved'").get().cnt,
    pendingDocs: db.prepare("SELECT COUNT(*) as cnt FROM documents WHERE status = 'pending'").get().cnt,
    unreadMsg: db.prepare('SELECT COUNT(*) as cnt FROM messages WHERE recipient_id = ? AND is_read = 0').get(session.id).cnt,
  }

  const myTasks = session.role === 'angajat' || session.role === 'manager'
    ? db.prepare(`
        SELECT t.*, u.name as assigner_name
        FROM tasks t LEFT JOIN users u ON t.assigned_by = u.id
        WHERE t.assigned_to = ? AND t.status != 'done'
        ORDER BY t.due_date LIMIT 3
      `).all(session.id)
    : []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bună dimineața' : hour < 18 ? 'Bună ziua' : 'Bună seara'

  const quickLinks = {
    admin: [
      { href: '/dashboard/utilizatori', icon: '👥', label: 'Utilizatori', desc: `${stats.users} activi` },
      { href: '/dashboard/documente', icon: '📄', label: 'Documente', desc: stats.pendingDocs > 0 ? `${stats.pendingDocs} în avizare` : 'Toate avizate' },
      { href: '/dashboard/anunturi', icon: '📢', label: 'Anunțuri', desc: 'Publică' },
      { href: '/dashboard/mesaje', icon: '✉️', label: 'Mesaje', desc: stats.unreadMsg > 0 ? `${stats.unreadMsg} necitite` : 'Niciun mesaj nou' },
    ],
    hr: [
      { href: '/dashboard/angajati', icon: '👥', label: 'Angajați', desc: `${stats.users} înregistrați` },
      { href: '/dashboard/cereri-concediu', icon: '🗓️', label: 'Cereri concediu', desc: stats.pendingLeave > 0 ? `${stats.pendingLeave} în așteptare` : 'Nicio cerere' },
      { href: '/dashboard/documente', icon: '📄', label: 'Documente HR', desc: stats.pendingDocs > 0 ? `${stats.pendingDocs} de avizat` : 'La zi' },
      { href: '/dashboard/mesaje', icon: '✉️', label: 'Mesaje', desc: stats.unreadMsg > 0 ? `${stats.unreadMsg} necitite` : 'Niciun mesaj nou' },
    ],
    financiar: [
      { href: '/dashboard/rapoarte', icon: '📊', label: 'Rapoarte', desc: 'Vezi statistici' },
      { href: '/dashboard/documente', icon: '📄', label: 'Documente', desc: `${stats.documents} avizate` },
      { href: '/dashboard/anunturi', icon: '📢', label: 'Anunțuri', desc: 'Citește' },
      { href: '/dashboard/mesaje', icon: '✉️', label: 'Mesaje', desc: stats.unreadMsg > 0 ? `${stats.unreadMsg} necitite` : 'Niciun mesaj nou' },
    ],
    manager: [
      { href: '/dashboard/echipa', icon: '👥', label: 'Echipa mea', desc: 'Vezi membri' },
      { href: '/dashboard/taskuri', icon: '✅', label: 'Taskuri', desc: 'Gestionează' },
      { href: '/dashboard/cereri-concediu', icon: '🗓️', label: 'Cereri concediu', desc: stats.pendingLeave > 0 ? `${stats.pendingLeave} de aprobat` : 'Nicio cerere' },
      { href: '/dashboard/mesaje', icon: '✉️', label: 'Mesaje', desc: stats.unreadMsg > 0 ? `${stats.unreadMsg} necitite` : 'Niciun mesaj nou' },
    ],
    angajat: [
      { href: '/dashboard/taskuri-mele', icon: '✅', label: 'Taskurile mele', desc: `${myTasks.length} active` },
      { href: '/dashboard/cerere-concediu', icon: '🗓️', label: 'Cerere concediu', desc: 'Depune' },
      { href: '/dashboard/documente', icon: '📄', label: 'Documente', desc: `${stats.documents} disponibile` },
      { href: '/dashboard/mesaje', icon: '✉️', label: 'Mesaje', desc: stats.unreadMsg > 0 ? `${stats.unreadMsg} necitite` : 'Niciun mesaj nou' },
    ],
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="text-blue-200 text-sm font-medium">{greeting},</p>
        <h1 className="text-2xl font-bold mt-0.5">{session.name}</h1>
        <p className="text-blue-200 text-sm mt-1">
          {new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats row — only for admin/hr/manager */}
      {['admin', 'hr', 'manager'].includes(session.role) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Angajați activi" value={stats.users} icon="👥" accent="blue" />
          <StatCard label="Departamente" value={stats.departments} icon="🏢" accent="violet" />
          <StatCard label="Cereri concediu" value={stats.pendingLeave} icon="🗓️" accent="amber" alert={stats.pendingLeave > 0} />
          <StatCard label="Documente avizate" value={stats.documents} icon="📄" accent="emerald" />
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Acces rapid</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(quickLinks[session.role] ?? quickLinks.angajat).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm group"
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{link.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* My tasks (angajat/manager) */}
      {myTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Taskuri active</h2>
            <Link href={session.role === 'manager' ? '/dashboard/taskuri' : '/dashboard/taskuri-mele'} className="text-xs text-blue-600 hover:text-blue-800">
              Vezi toate →
            </Link>
          </div>
          <div className="space-y-2">
            {myTasks.map(t => {
              const overdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
              return (
                <div key={t.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${t.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{t.title}</p>
                      <p className="text-xs text-gray-400">de la {t.assigner_name}</p>
                    </div>
                  </div>
                  {t.due_date && (
                    <span className={`text-xs px-2 py-1 rounded-lg shrink-0 ${overdue ? 'bg-red-100 text-red-600 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                      {overdue ? '⚠ ' : ''}{t.due_date}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Anunțuri recente</h2>
          <Link href="/dashboard/anunturi" className="text-xs text-blue-600 hover:text-blue-800">
            Vezi toate →
          </Link>
        </div>
        {announcements.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
            Niciun anunț disponibil.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((ann, i) => (
              <div key={ann.id} className={`bg-white border rounded-xl p-4 ${i === 0 ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'}`}>
                <p className="font-semibold text-gray-800 text-sm leading-snug">{ann.title}</p>
                <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{ann.content}</p>
                <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                  <span>{ann.author_name}</span>
                  <span>·</span>
                  <span>{new Date(ann.created_at).toLocaleDateString('ro-RO')}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, accent, alert = false }) {
  const accents = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', val: 'text-blue-700' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', val: 'text-violet-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', val: 'text-amber-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', val: 'text-emerald-700' },
  }
  const a = accents[accent]
  return (
    <div className={`bg-white rounded-xl border p-4 ${alert ? 'border-amber-200' : 'border-gray-200'}`}>
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg ${a.bg} ${a.text} mb-3`}>
        {icon}
      </div>
      <div className={`text-3xl font-bold ${a.val}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
    </div>
  )
}
