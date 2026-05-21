'use server'

import { getDb } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addAnnouncement(formData, authorId) {
  const title = formData.get('title')?.toString().trim()
  const content = formData.get('content')?.toString().trim()
  if (!title || !content) return { error: 'Completați titlul și conținutul.' }

  const db = getDb()
  db.prepare('INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)').run(title, content, authorId)
  revalidatePath('/dashboard/anunturi')
  revalidatePath('/dashboard')
}
