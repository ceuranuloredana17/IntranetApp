'use server'

import { getDb } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function sendMessage(prevState, formData) {
  const session = await requireSession()
  const recipient_id = parseInt(formData.get('recipient_id')?.toString() ?? '')
  const subject = formData.get('subject')?.toString().trim()
  const content = formData.get('content')?.toString().trim()

  if (!recipient_id || !subject || !content) return { error: 'Completați toate câmpurile.' }
  if (recipient_id === session.id) return { error: 'Nu vă puteți trimite mesaj vouă înșivă.' }

  const db = getDb()
  const recipient = db.prepare('SELECT id FROM users WHERE id = ?').get(recipient_id)
  if (!recipient) return { error: 'Destinatar inexistent.' }

  db.prepare(`
    INSERT INTO messages (sender_id, recipient_id, subject, content)
    VALUES (?, ?, ?, ?)
  `).run(session.id, recipient_id, subject, content)

  revalidatePath('/dashboard/mesaje')
  return { success: 'Mesaj trimis cu succes!' }
}

export async function markAsRead(messageId) {
  'use server'
  const session = await requireSession()
  const db = getDb()
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ? AND recipient_id = ?').run(messageId, session.id)
  revalidatePath('/dashboard/mesaje')
}

export async function markAllAsRead() {
  'use server'
  const session = await requireSession()
  const db = getDb()
  db.prepare('UPDATE messages SET is_read = 1 WHERE recipient_id = ?').run(session.id)
  revalidatePath('/dashboard/mesaje')
}
