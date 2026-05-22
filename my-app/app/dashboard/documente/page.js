import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import AddDocumentForm from './AddDocumentForm'
import DocumentActions from './DocumentActions'

const statusColors = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
}
const statusLabels = { draft: 'Ciornă', pending: 'În avizare', approved: 'Avizat' }

const categoryIcons = { HR: '👥', Financiar: '💰', Tehnic: '💻', Marketing: '📣', General: '📋' }

export default async function DocumentePage() {
  const session = await requireSession()
  const db = getDb()
  const canCreate = ['admin', 'hr', 'manager', 'financiar'].includes(session.role)
  const canApprove = ['admin', 'hr', 'manager'].includes(session.role)

  // Angajații văd doar documente aprobate; ceilalți văd toate
  const documente = session.role === 'angajat'
    ? db.prepare(`
        SELECT doc.*, d.name as dept_name, u.name as author_name, a.name as approver_name
        FROM documents doc
        LEFT JOIN departments d ON doc.department_id = d.id
        LEFT JOIN users u ON doc.created_by = u.id
        LEFT JOIN users a ON doc.approved_by = a.id
        WHERE doc.status = 'approved'
        ORDER BY doc.category, doc.created_at DESC
      `).all()
    : db.prepare(`
        SELECT doc.*, d.name as dept_name, u.name as author_name, a.name as approver_name
        FROM documents doc
        LEFT JOIN departments d ON doc.department_id = d.id
        LEFT JOIN users u ON doc.created_by = u.id
        LEFT JOIN users a ON doc.approved_by = a.id
        ORDER BY CASE doc.status WHEN 'pending' THEN 0 WHEN 'draft' THEN 1 ELSE 2 END, doc.created_at DESC
      `).all()

  const pending = documente.filter(d => d.status === 'pending')
  const categories = [...new Set(documente.filter(d => d.status === 'approved').map(d => d.category))]

  const departments = db.prepare('SELECT * FROM departments ORDER BY name').all()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Documente Interne</h1>
          <p className="text-gray-500 text-sm">{documente.length} documente</p>
        </div>
        {canCreate && <AddDocumentForm departments={departments} />}
      </div>

      {/* Documente în așteptare avizare */}
      {canApprove && pending.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <span>⏳</span> Documente în așteptare avizare ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg border border-yellow-200 p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800">{doc.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.author_name} · {doc.category} · {doc.dept_name}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{doc.content}</p>
                </div>
                <DocumentActions doc={doc} sessionId={session.id} sessionRole={session.role} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documente ciornă ale utilizatorului curent */}
      {canCreate && (() => {
        const myDrafts = documente.filter(d => d.status === 'draft' && d.created_by === session.id)
        return myDrafts.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <span>📝</span>
              <h2 className="font-semibold text-gray-700">Ciornele mele ({myDrafts.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {myDrafts.map(doc => (
                <div key={doc.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{doc.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[doc.status]}`}>
                        {statusLabels[doc.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{doc.content}</p>
                  </div>
                  <DocumentActions doc={doc} sessionId={session.id} sessionRole={session.role} />
                </div>
              ))}
            </div>
          </div>
        ) : null
      })()}

      {/* Documente avizate pe categorii */}
      {categories.map(cat => (
        <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <span>{categoryIcons[cat] ?? '📁'}</span>
            <h2 className="font-semibold text-gray-700">{cat}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {documente.filter(d => d.status === 'approved' && d.category === cat).map(doc => (
              <div key={doc.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                      Avizat
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {doc.author_name} · {doc.dept_name}
                    {doc.approver_name && ` · Avizat de ${doc.approver_name}`}
                    {' · '}{new Date(doc.created_at).toLocaleDateString('ro-RO')}
                  </p>
                </div>
                {(session.role === 'admin' || doc.created_by === session.id) && (
                  <DocumentActions doc={doc} sessionId={session.id} sessionRole={session.role} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {documente.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          Niciun document disponibil.
        </div>
      )}
    </div>
  )
}
