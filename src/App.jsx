import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import AddResearch from './pages/AddResearch';
import VajraAssistant from './pages/VajraAssistant';
import KnowledgeTransfer from './pages/KnowledgeTransfer';

export default function App() {
  return (
    <ToastProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="add-research" element={<AddResearch />} />
              <Route path="vajra" element={<VajraAssistant />} />
              <Route path="transfer" element={<KnowledgeTransfer />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </ToastProvider>
  );
}
