import React, { useEffect } from 'react';
import { useAuth } from '../lib/api';

export default function Dashboard() {
  const { modules, refreshModules } = useAuth();
  useEffect(() => { refreshModules(); }, [refreshModules]);
  return (
    <div style={{ padding: 24 }}>
      <h1>NEXA ERP</h1>
      <p>Módulos activos: {modules.join(', ') || 'ninguno'}</p>
    </div>
  );
}
