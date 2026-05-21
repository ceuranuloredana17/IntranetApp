import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function DepartamentePage() {
  await requireRole('admin')
  const db = getDb()

  const departments = db.prepare(`
    SELECT d.*, COUNT(u.id) as nr_angajati
    FROM departments d
    LEFT JOIN users u ON u.department_id = d.id
    GROUP BY d.id
    ORDER BY d.name
  `).all()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Departamente</h1>
        <p className="text-gray-500 text-sm">{departments.length} departamente active</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                🏢
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                <p className="text-xs text-gray-400">ID: {dept.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>👥</span>
              <span>{dept.nr_angajati} angajat{dept.nr_angajati !== 1 ? 'i' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
