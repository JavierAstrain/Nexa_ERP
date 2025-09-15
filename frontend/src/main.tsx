import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './modules/crm/Customers'
import Products from './modules/inventory/Products'
import Invoices from './modules/accounting/Invoices'
import { ApiProvider, useAuth } from './lib/api'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/crm/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/inventory/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/accounting/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  </React.StrictMode>
)
