import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import AddAnuntForm from './AddAnuntForm'

export default async function AnunturiPage() {
  const session = await requireSession()
  const db = getDb()
  const canPost = ['admin', 'hr', 'manager'].includes(session.role)

  const anunturi = db.prepare(`
    SELECT a.*, u.name as author_name, u.role as author_role
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.id
    ORDER BY a.created_at DESC
  `).all()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Anunțuri</h1>
          <p className="text-gray-500 text-sm">{anunturi.length} anunțuri</p>
        </div>
      </div>

      {canPost && <AddAnuntForm authorId={session.id} />}

      <div className="space-y-4">
        {anunturi.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800">{a.title}</h2>
            <p className="text-gray-600 mt-2">{a.content}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <span>✍️ {a.author_name}</span>
              <span>·</span>
              <span>{new Date(a.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
        {anunturi.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            Niciun anunț disponibil.
          </div>
        )}
      </div>
    </div>
  )
}
