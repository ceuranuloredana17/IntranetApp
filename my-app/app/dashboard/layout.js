import { requireSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default async function DashboardLayout({ children }) {
  const session = await requireSession()
  const db = getDb()

  const unreadMessages = db.prepare(
    'SELECT COUNT(*) as cnt FROM messages WHERE recipient_id = ? AND is_read = 0'
  ).get(session.id).cnt

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={session.role} unreadMessages={unreadMessages} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={session} unreadMessages={unreadMessages} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
