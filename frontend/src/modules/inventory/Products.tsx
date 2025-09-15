import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../lib/api'

type Product = { id:string, sku:string, name:string, price:number }

const Products: React.FC = () => {
  const { api } = useAuth()
  const [list, setList] = useState<Product[]>([])
  const [form, setForm] = useState<Partial<Product>>({})

  const load = async ()=>{
    const { data } = await api.get('/inventory/products')
    setList(data)
  }
  useEffect(()=>{ load() }, [])

  const save = async (e: React.FormEvent)=>{
    e.preventDefault()
    await api.post('/inventory/products', { ...form, price: Number(form.price || 0) })
    setForm({})
    load()
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Productos</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Precio</th>
              </tr>
            </thead>
            <tbody>
              {list.map(p=> (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Nuevo producto</h3>
          <form className="space-y-2" onSubmit={save}>
            <input className="input" placeholder="SKU" value={form.sku||''} onChange={e=>setForm({...form, sku:e.target.value})}/>
            <input className="input" placeholder="Nombre" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})}/>
            <input className="input" placeholder="Precio" value={form.price as any || ''} onChange={e=>setForm({...form, price:e.target.value as any})}/>
            <button className="btn w-full" type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Products