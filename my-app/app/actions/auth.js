'use server'

import { compareSync } from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function login(prevState, formData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { error: 'Completați toate câmpurile.' }
  }

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

  if (!user || !compareSync(password, user.password_hash)) {
    return { error: 'Email sau parolă incorectă.' }
  }

  await createSession(user)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
