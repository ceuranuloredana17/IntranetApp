import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function RapoartePage() {
  await requireRole('financiar', 'admin')
  const db = getDb()

  const users = db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt
  const departments = db.prepare('SELECT COUNT(*) as cnt FROM departments').get().cnt
  const totalLeave = db.prepare('SELECT COUNT(*) as cnt FROM leave_requests').get().cnt
  const approvedLeave = db.prepare("SELECT COUNT(*) as cnt FROM leave_requests WHERE status='approved'").get().cnt
  const docs = db.prepare('SELECT COUNT(*) as cnt FROM documents').get().cnt

  const deptStats = db.prepare(`
    SELECT d.name, COUNT(u.id) as nr_angajati
    FROM departments d
    LEFT JOIN users u ON u.department_id = d.id
    GROUP BY d.id, d.name
    ORDER BY nr_angajati DESC
  `).all()

  const recentDocs = db.prepare(`
    SELECT doc.*, d.name as dept_name, u.name as author_name
    FROM documents doc
    LEFT JOIN departments d ON doc.department_id = d.id
    LEFT JOIN users u ON doc.created_by = u.id
    WHERE doc.category = 'Financiar'
    ORDER BY doc.created_at DESC
  `).all()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Rapoarte Financiare & Statistici</h1>
        <p className="text-gray-500 text-sm">Vedere de ansamblu asupra organizației</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total angajați" value={users} icon="👥" />
        <StatCard label="Departamente" value={departments} icon="🏢" />
        <StatCard label="Concedii aprobate" value={approvedLeave} icon="✅" />
        <StatCard label="Documente" value={docs} icon="📄" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Angajați pe departamente</h2>
          <div className="space-y-3">
            {deptStats.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{d.name}</span>
                  <span className="font-medium text-gray-800">{d.nr_angajati}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.max(5, (d.nr_angajati / users) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cereri concediu</h2>
          <div className="space-y-3">
            {[
              { label: 'Aprobate', value: approvedLeave, color: 'bg-green-500' },
              { label: 'Respinse', value: db.prepare("SELECT COUNT(*) as cnt FROM leave_requests WHERE status='rejected'").get().cnt, color: 'bg-red-400' },
              { label: 'În așteptare', value: db.prepare("SELECT COUNT(*) as cnt FROM leave_requests WHERE status='pending'").get().cnt, color: 'bg-yellow-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📄 Documente financiare</h2>
        {recentDocs.length === 0 ? (
          <p className="text-gray-400 text-sm">Niciun document financiar disponibil.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="py-3">
                <p className="font-medium text-gray-800">{doc.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.author_name} · {new Date(doc.created_at).toLocaleDateString('ro-RO')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
