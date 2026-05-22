'use client'

import { useState, useTransition } from 'react'
import { markAsRead, markAllAsRead } from '@/app/actions/messages'

const roleLabels = {
  admin: 'Administrator', hr: 'HR', financiar: 'Financiar',
  manager: 'Manager', angajat: 'Angajat',
}

export default function MessageList({ inbox, sent }) {
  const [tab, setTab] = useState('inbox')
  const [selected, setSelected] = useState(null)
  const [pending, startTransition] = useTransition()

  const messages = tab === 'inbox' ? inbox : sent
  const unreadCount = inbox.filter(m => !m.is_read).length

  function openMessage(msg) {
    setSelected(msg)
    if (tab === 'inbox' && !msg.is_read) {
      startTransition(() => markAsRead(msg.id))
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex" style={{ minHeight: '500px' }}>
      {/* Left panel — list */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setTab('inbox'); setSelected(null) }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'inbox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inbox
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => { setTab('sent'); setSelected(null) }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'sent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Trimise
          </button>
        </div>

        {tab === 'inbox' && unreadCount > 0 && (
          <div className="px-3 py-2 border-b border-gray-100">
            <button
              onClick={() => startTransition(() => markAllAsRead())}
              disabled={pending}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Marchează toate ca citite
            </button>
          </div>
        )}

        {/* Message list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Niciun mesaj.</div>
          ) : (
            messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {tab === 'inbox' && !msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <p className={`text-sm truncate ${!msg.is_read && tab === 'inbox' ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {tab === 'inbox' ? msg.sender_name : msg.recipient_name}
                      </p>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.is_read && tab === 'inbox' ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel — message detail */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-3">✉️</div>
              <p className="text-sm">Selectați un mesaj pentru a-l citi</p>
            </div>
          </div>
        ) : (
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{selected.subject}</h2>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {(tab === 'inbox' ? selected.sender_name : selected.recipient_name)?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {tab === 'inbox'
                    ? <>De la: <span className="text-blue-600">{selected.sender_name}</span></>
                    : <>Către: <span className="text-blue-600">{selected.recipient_name}</span></>
                  }
                </p>
                <p className="text-xs text-gray-400">
                  {roleLabels[tab === 'inbox' ? selected.sender_role : selected.recipient_role]}
                  {' · '}
                  {new Date(selected.created_at).toLocaleDateString('ro-RO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
