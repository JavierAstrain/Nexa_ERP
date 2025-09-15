import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Customers from "./modules/crm/Customers";
import Products from "./modules/inventory/Products";
import Invoices from "./modules/accounting/Invoices";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crm/customers" element={<Customers />} />
              <Route path="inventory/products" element={<Products />} />
              <Route path="accounting/invoices" element={<Invoices />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div className="p-6">404</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

