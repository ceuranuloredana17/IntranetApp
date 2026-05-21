'use server'

import { getDb } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function submitLeaveRequest(prevState, formData) {
  const session = await requireSession()
  const start_date = formData.get('start_date')?.toString()
  const end_date = formData.get('end_date')?.toString()
  const reason = formData.get('reason')?.toString()

  if (!start_date || !end_date) {
    return { error: 'Completați datele de început și sfârșit.' }
  }
  if (start_date > end_date) {
    return { error: 'Data de început trebuie să fie înaintea datei de sfârșit.' }
  }

  const db = getDb()
  db.prepare(`
    INSERT INTO leave_requests (user_id, start_date, end_date, reason)
    VALUES (?, ?, ?, ?)
  `).run(session.id, start_date, end_date, reason ?? '')

  revalidatePath('/dashboard/cerere-concediu')
  revalidatePath('/dashboard/cereri-concediu')
  return { success: 'Cererea a fost trimisă cu succes!' }
}

export async function reviewLeaveRequest(requestId, reviewerId, status) {
  'use server'
  const db = getDb()
  db.prepare(`
    UPDATE leave_requests SET status = ?, reviewed_by = ? WHERE id = ?
  `).run(status, reviewerId, requestId)
  revalidatePath('/dashboard/cereri-concediu')
}
