import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import StatusButton from './StatusButton'

export default async function TaskuriMelePage() {
  const session = await requireSession()
  const db = getDb()

  const tasks = db.prepare(`
    SELECT t.*, u.name as assigner_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_by = u.id
    WHERE t.assigned_to = ?
    ORDER BY CASE t.status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END, t.due_date
  `).all(session.id)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }
  const statusLabels = { pending: 'Pending', in_progress: 'În lucru', done: 'Finalizat' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Taskurile Mele</h1>
        <p className="text-gray-500 text-sm">{tasks.filter(t => t.status !== 'done').length} taskuri active</p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          Nu ai taskuri asignate momentan.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-800">{t.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[t.status]}`}>
                      {statusLabels[t.status]}
                    </span>
                  </div>
                  {t.description && <p className="text-sm text-gray-500">{t.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Asignat de: {t.assigner_name}</span>
                    {t.due_date && (
                      <span className={new Date(t.due_date) < new Date() && t.status !== 'done' ? 'text-red-500 font-medium' : ''}>
                        Termen: {t.due_date}
                      </span>
                    )}
                  </div>
                </div>
                {t.status !== 'done' && <StatusButton taskId={t.id} currentStatus={t.status} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
