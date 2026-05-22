import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import ComposeModal from './ComposeModal'
import MessageList from './MessageList'

export default async function MesajePage() {
  const session = await requireSession()
  const db = getDb()

  const inbox = db.prepare(`
    SELECT m.*, u.name as sender_name, u.role as sender_role
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.recipient_id = ?
    ORDER BY m.created_at DESC
  `).all(session.id)

  const sent = db.prepare(`
    SELECT m.*, u.name as recipient_name, u.role as recipient_role
    FROM messages m
    JOIN users u ON m.recipient_id = u.id
    WHERE m.sender_id = ?
    ORDER BY m.created_at DESC
  `).all(session.id)

  const users = db.prepare(`
    SELECT id, name, role, department_id FROM users WHERE id != ? ORDER BY name
  `).all(session.id)

  const unread = inbox.filter(m => !m.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mesagerie Internă</h1>
          {unread > 0 && (
            <p className="text-sm text-blue-600 font-medium">{unread} mesaj{unread !== 1 ? 'e' : ''} necitit{unread !== 1 ? 'e' : ''}</p>
          )}
        </div>
        <ComposeModal users={users} />
      </div>

      <MessageList inbox={inbox} sent={sent} />
    </div>
  )
}
