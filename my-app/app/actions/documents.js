'use server'

import { getDb } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createDocument(prevState, formData) {
  const session = await requireSession()
  if (!['admin', 'hr', 'manager', 'financiar'].includes(session.role)) {
    return { error: 'Nu aveți permisiunea de a crea documente.' }
  }

  const title = formData.get('title')?.toString().trim()
  const content = formData.get('content')?.toString().trim()
  const category = formData.get('category')?.toString()

  if (!title || !content || !category) return { error: 'Completați toate câmpurile obligatorii.' }

  const db = getDb()
  db.prepare(`
    INSERT INTO documents (title, content, category, department_id, created_by, status)
    VALUES (?, ?, ?, ?, ?, 'draft')
  `).run(title, content, category, session.department_id, session.id)

  revalidatePath('/dashboard/documente')
  return { success: 'Document salvat ca ciornă.' }
}

export async function submitForApproval(docId) {
  'use server'
  const session = await requireSession()
  const db = getDb()
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId)
  if (!doc) return
  if (doc.created_by !== session.id && session.role !== 'admin') return

  db.prepare("UPDATE documents SET status = 'pending' WHERE id = ?").run(docId)
  revalidatePath('/dashboard/documente')
}

export async function approveDocument(docId) {
  'use server'
  const session = await requireSession()
  if (!['admin', 'hr', 'manager'].includes(session.role)) return

  const db = getDb()
  db.prepare("UPDATE documents SET status = 'approved', approved_by = ? WHERE id = ?").run(session.id, docId)
  revalidatePath('/dashboard/documente')
}

export async function rejectDocument(docId) {
  'use server'
  const session = await requireSession()
  if (!['admin', 'hr', 'manager'].includes(session.role)) return

  const db = getDb()
  db.prepare("UPDATE documents SET status = 'draft' WHERE id = ?").run(docId)
  revalidatePath('/dashboard/documente')
}

export async function deleteDocument(docId) {
  'use server'
  const session = await requireSession()
  const db = getDb()
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId)
  if (!doc) return
  if (doc.created_by !== session.id && session.role !== 'admin') return

  db.prepare('DELETE FROM documents WHERE id = ?').run(docId)
  revalidatePath('/dashboard/documente')
}
