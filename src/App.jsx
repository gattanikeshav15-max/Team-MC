import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Systems from './pages/Systems';
import SystemDetails from './pages/SystemDetails';
import Components from './pages/Components';
import ComponentDetails from './pages/ComponentDetails';
import Incidents from './pages/Incidents';
import IncidentDetails from './pages/IncidentDetails';
import VajraAssistant from './pages/VajraAssistant';
import MemoryExplorer from './pages/MemoryExplorer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ToastProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="systems" element={<Systems />} />
              <Route path="systems/:id" element={<SystemDetails />} />
              <Route path="components" element={<Components />} />
              <Route path="components/:id" element={<ComponentDetails />} />
              <Route path="incidents" element={<Incidents />} />
              <Route path="incidents/:id" element={<IncidentDetails />} />
              <Route path="vajra" element={<VajraAssistant />} />
              <Route path="memories" element={<MemoryExplorer />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </ToastProvider>
  );
}
