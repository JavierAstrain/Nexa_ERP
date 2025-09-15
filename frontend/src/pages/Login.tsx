import React, { useState } from 'react'
import { useAuth } from '../lib/api'

const Login: React.FC = () => {
  const { api, setToken } = useAuth()
  const [email, setEmail] = useState('admin@nexaerp.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error de autenticación')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="card p-8 rounded-2xl w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <img src="/assets/Isotipo_Nexa.png" className="h-8 w-8 drop-shadow-[0_0_12px_rgba(46,153,255,0.7)]" />
          <h1 className="text-2xl font-semibold">NEXA ERP</h1>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="btn w-full" type="submit">Ingresar</button>
        </form>
        <p className="text-xs mt-3 text-slate-400">Usuario demo: admin@nexaerp.com / admin123 (ejecuta el seed)</p>
      </div>
    </div>
  )
}

export default Login