import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../lib/api'

const Dashboard: React.FC = () => {
  const { api, modules, refreshModules } = useAuth()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => { (async()=>{
    await refreshModules()
    try{
      const [customers, products, invoices] = await Promise.all([
        api.get('/crm/customers'), api.get('/inventory/products'), api.get('/accounting/invoices')
      ])
      setStats({ customers: customers.data.length, products: products.data.length, invoices: invoices.data.length })
    } catch { setStats({ customers: 0, products: 0, invoices: 0 }) }
  })() }, [])

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Bienvenido a NEXA ERP</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4 rounded-xl">
          <div className="text-slate-400">Clientes</div>
          <div className="text-3xl font-bold">{stats?.customers ?? '-'}</div>
        </div>
        <div className="card p-4 rounded-xl">
          <div className="text-slate-400">Productos</div>
          <div className="text-3xl font-bold">{stats?.products ?? '-'}</div>
        </div>
        <div className="card p-4 rounded-xl">
          <div className="text-slate-400">Facturas</div>
          <div className="text-3xl font-bold">{stats?.invoices ?? '-'}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Módulos activos</h3>
        <div className="flex flex-wrap gap-2">
          {modules.map(m => <span key={m} className="px-3 py-1 rounded-full bg-nexa-700/30 border border-nexa-600/50">{m}</span>)}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard