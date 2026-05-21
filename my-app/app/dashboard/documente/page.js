import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'

export default async function DocumentePage() {
  const session = await requireSession()
  const db = getDb()

  const documente = db.prepare(`
    SELECT doc.*, d.name as dept_name, u.name as author_name
    FROM documents doc
    LEFT JOIN departments d ON doc.department_id = d.id
    LEFT JOIN users u ON doc.created_by = u.id
    ORDER BY doc.category, doc.created_at DESC
  `).all()

  const categories = [...new Set(documente.map(d => d.category))]

  const categoryIcons = {
    HR: '👥',
    Financiar: '💰',
    Tehnic: '💻',
    Marketing: '📣',
    General: '📋',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Documente Interne</h1>
        <p className="text-gray-500 text-sm">{documente.length} documente disponibile</p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <span>{categoryIcons[cat] ?? '📁'}</span>
            <h2 className="font-semibold text-gray-700">{cat}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {documente.filter(d => d.category === cat).map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {doc.author_name} · {doc.dept_name} · {new Date(doc.created_at).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full ml-4 whitespace-nowrap">
                    {doc.dept_name}
                  </span>
                </div>
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
