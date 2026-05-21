'use server'

import { getDb } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addTask(formData, managerId) {
  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim()
  const assigned_to = formData.get('assigned_to')?.toString()
  const due_date = formData.get('due_date')?.toString() || null

  if (!title || !assigned_to) return { error: 'Completați titlul și persoana asignată.' }

  const db = getDb()
  db.prepare(`
    INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description || null, parseInt(assigned_to), managerId, due_date)

  revalidatePath('/dashboard/taskuri')
  revalidatePath('/dashboard/taskuri-mele')
}

export async function updateTaskStatus(taskId, status) {
  'use server'
  const db = getDb()
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, taskId)
  revalidatePath('/dashboard/taskuri-mele')
  revalidatePath('/dashboard/taskuri')
}
