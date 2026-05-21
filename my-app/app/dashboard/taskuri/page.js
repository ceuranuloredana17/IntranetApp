import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'
import AddTaskForm from './AddTaskForm'

export default async function TaskuriPage() {
  const session = await requireRole('manager', 'admin')
  const db = getDb()

  const tasks = db.prepare(`
    SELECT t.*, u.name as assignee_name, u.email as assignee_email
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.assigned_by = ?
    ORDER BY CASE t.status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END, t.due_date
  `).all(session.id)

  const teamMembers = db.prepare(`
    SELECT id, name FROM users
    WHERE department_id = (SELECT department_id FROM users WHERE id = ?)
    AND id != ? AND role IN ('angajat','manager')
  `).all(session.id, session.id)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }
  const statusLabels = { pending: 'Pending', in_progress: 'În lucru', done: 'Finalizat' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestionare Taskuri</h1>
        <p className="text-gray-500 text-sm">{tasks.filter(t => t.status !== 'done').length} taskuri active</p>
      </div>

      <AddTaskForm teamMembers={teamMembers} managerId={session.id} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Niciun task creat încă.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((t) => (
              <div key={t.id} className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{t.title}</p>
                  {t.description && <p className="text-sm text-gray-500 mt-0.5">{t.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>👤 {t.assignee_name ?? '—'}</span>
                    {t.due_date && <span>📅 Termen: {t.due_date}</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[t.status]}`}>
                  {statusLabels[t.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
