import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function AngajatiPage() {
  await requireRole('hr', 'admin')
  const db = getDb()

  const angajati = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at, d.name as dept_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.role != 'admin'
    ORDER BY u.name
  `).all()

  const roleLabels = { hr: 'HR', financiar: 'Financiar', manager: 'Manager', angajat: 'Angajat' }
  const roleColors = {
    hr: 'bg-purple-100 text-purple-700',
    financiar: 'bg-green-100 text-green-700',
    manager: 'bg-orange-100 text-orange-700',
    angajat: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrul Angajaților</h1>
        <p className="text-gray-500 text-sm">{angajati.length} angajați activi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {angajati.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {a.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{a.name}</p>
                <p className="text-xs text-gray-400">{a.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">🏢 {a.dept_name ?? '—'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[a.role]}`}>
                {roleLabels[a.role]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Activ din {new Date(a.created_at).toLocaleDateString('ro-RO')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
