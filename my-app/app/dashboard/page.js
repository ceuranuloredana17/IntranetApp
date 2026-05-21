import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function DashboardPage() {
  const session = await requireSession()
  const db = getDb()

  const announcements = db.prepare(`
    SELECT a.*, u.name as author_name
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 5
  `).all()

  const stats = {
    users: db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt,
    departments: db.prepare('SELECT COUNT(*) as cnt FROM departments').get().cnt,
    pendingLeave: db.prepare("SELECT COUNT(*) as cnt FROM leave_requests WHERE status = 'pending'").get().cnt,
    documents: db.prepare('SELECT COUNT(*) as cnt FROM documents').get().cnt,
  }

  const roleWelcome = {
    admin: 'Bun venit, Administrator!',
    hr: 'Bun venit în panoul HR!',
    financiar: 'Bun venit în panoul Financiar!',
    manager: 'Bun venit, Manager!',
    angajat: `Bun venit, ${session.name}!`,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{roleWelcome[session.role]}</h1>
        <p className="text-gray-500 text-sm mt-1">Iată un rezumat al activității de astăzi.</p>
      </div>

      {(session.role === 'admin' || session.role === 'hr' || session.role === 'manager') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Angajați" value={stats.users} icon="👥" color="blue" />
          <StatCard label="Departamente" value={stats.departments} icon="🏢" color="purple" />
          <StatCard label="Cereri concediu" value={stats.pendingLeave} icon="🗓️" color="orange" />
          <StatCard label="Documente" value={stats.documents} icon="📄" color="green" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📢</span> Anunțuri recente
        </h2>
        {announcements.length === 0 ? (
          <p className="text-gray-400 text-sm">Niciun anunț disponibil.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-800">{ann.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{ann.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {ann.author_name} · {new Date(ann.created_at).toLocaleDateString('ro-RO')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl ${colors[color]} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
