import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../lib/api'

type Customer = { id:string, name:string, email?:string, phone?:string, notes?:string }

const Customers: React.FC = () => {
  const { api } = useAuth()
  const [list, setList] = useState<Customer[]>([])
  const [form, setForm] = useState<Partial<Customer>>({})

  const load = async ()=>{
    const { data } = await api.get('/crm/customers')
    setList(data)
  }
  useEffect(()=>{ load() }, [])

  const save = async (e: React.FormEvent)=>{
    e.preventDefault()
    await api.post('/crm/customers', form)
    setForm({})
    load()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Clientes</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {list.map(c=> (
                  <tr key={c.id} className="border-t border-white/5">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Nuevo cliente</h3>
          <form className="space-y-2" onSubmit={save}>
            <input className="input" placeholder="Nombre" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})}/>
            <input className="input" placeholder="Email" value={form.email||''} onChange={e=>setForm({...form, email:e.target.value})}/>
            <input className="input" placeholder="Teléfono" value={form.phone||''} onChange={e=>setForm({...form, phone:e.target.value})}/>
            <textarea className="input" placeholder="Notas" value={form.notes||''} onChange={e=>setForm({...form, notes:e.target.value})}/>
            <button className="btn w-full" type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Customers