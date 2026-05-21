'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">TechSoft Intranet</h1>
          <p className="text-gray-500 text-sm mt-1">Autentificați-vă pentru a continua</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nume@techsoft.ro"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Parolă
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {pending ? 'Se autentifică...' : 'Autentificare'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Conturi demo:</p>
          <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-500">
            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
              <span className="font-medium">Admin</span>
              <span>admin@techsoft.ro / Admin@123</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
              <span className="font-medium">HR</span>
              <span>hr@techsoft.ro / Hr@12345</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
              <span className="font-medium">Financiar</span>
              <span>financiar@techsoft.ro / Fin@1234</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
              <span className="font-medium">Manager</span>
              <span>manager@techsoft.ro / Mgr@1234</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
              <span className="font-medium">Angajat</span>
              <span>ion.vasile@techsoft.ro / Ang@1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
