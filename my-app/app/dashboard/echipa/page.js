import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function EchipaPage() {
  const session = await requireRole('manager', 'admin')
  const db = getDb()

  const echipa = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at, d.name as dept_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.department_id = (
      SELECT department_id FROM users WHERE id = ?
    ) AND u.id != ?
  `).all(session.id, session.id)

  const taskStats = db.prepare(`
    SELECT status, COUNT(*) as cnt
    FROM tasks
    WHERE assigned_by = ?
    GROUP BY status
  `).all(session.id)

  const statsMap = Object.fromEntries(taskStats.map(t => [t.status, t.cnt]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Echipa Mea</h1>
        <p className="text-gray-500 text-sm">{echipa.length} membri în echipă</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statsMap.pending ?? 0}</div>
          <div className="text-sm text-gray-500">Taskuri pending</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statsMap.in_progress ?? 0}</div>
          <div className="text-sm text-gray-500">În lucru</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statsMap.done ?? 0}</div>
          <div className="text-sm text-gray-500">Finalizate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Membrii echipei</h2>
        {echipa.length === 0 ? (
          <p className="text-gray-400 text-sm">Nu există alți membri în departament.</p>
        ) : (
          <div className="space-y-3">
            {echipa.map((m) => {
              const myTasks = db.prepare(`
                SELECT COUNT(*) as cnt FROM tasks WHERE assigned_to = ? AND status != 'done'
              `).get(m.id)
              return (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{myTasks.cnt} taskuri active</p>
                    <p className="text-xs text-gray-400">{m.dept_name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
