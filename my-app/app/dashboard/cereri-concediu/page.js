import { requireRole } from '@/lib/auth'
import { getDb } from '@/lib/db'
import ApproveButton from './ApproveButton'

export default async function CereriConcediuPage() {
  const session = await requireRole('hr', 'manager', 'admin')
  const db = getDb()

  const cereri = db.prepare(`
    SELECT lr.*, u.name as user_name, u.email, d.name as dept_name,
           r.name as reviewer_name
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users r ON lr.reviewed_by = r.id
    ORDER BY CASE lr.status WHEN 'pending' THEN 0 ELSE 1 END, lr.created_at DESC
  `).all()

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  const statusLabels = { pending: 'În așteptare', approved: 'Aprobat', rejected: 'Respins' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cereri de Concediu</h1>
        <p className="text-gray-500 text-sm">
          {cereri.filter(c => c.status === 'pending').length} cereri în așteptare
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {cereri.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Nicio cerere înregistrată.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cereri.map((c) => (
              <div key={c.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {c.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{c.user_name}</p>
                    <p className="text-xs text-gray-400">{c.dept_name} · {c.email}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 text-center">
                  <p className="font-medium">{c.start_date} → {c.end_date}</p>
                  {c.reason && <p className="text-xs text-gray-400 mt-0.5">{c.reason}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status]}`}>
                    {statusLabels[c.status]}
                  </span>
                  {c.status === 'pending' && (
                    <ApproveButton requestId={c.id} reviewerId={session.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
