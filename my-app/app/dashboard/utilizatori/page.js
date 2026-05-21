import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function UtilizatoriPage() {
  await requireRole('admin')
  const db = getDb()

  const users = db.prepare(`
    SELECT u.*, d.name as dept_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    ORDER BY u.name
  `).all()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestionare Utilizatori</h1>
          <p className="text-gray-500 text-sm">{users.length} utilizatori înregistrați</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nume</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departament</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.dept_name ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('ro-RO')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
