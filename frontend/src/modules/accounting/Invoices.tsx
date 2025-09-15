import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../lib/api'

const Invoices: React.FC = () => {
  const { api } = useAuth()
  const [list, setList] = useState<any[]>([])

  const load = async ()=>{
    const { data } = await api.get('/accounting/invoices')
    setList(data)
  }
  useEffect(()=>{ load() }, [])

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Facturas</h2>
      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3">Número</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {list.map(inv=> (
              <tr key={inv.id} className="border-t border-white/5">
                <td className="p-3">{inv.number}</td>
                <td className="p-3">{inv.customer?.name}</td>
                <td className="p-3">${inv.total}</td>
                <td className="p-3">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Invoices