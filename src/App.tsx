import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './lib/language-context';
import { Toaster } from 'sonner';
import DashboardPage from './pages/dashboard-page';
import ClarifyPage from './pages/clarify-page';
import PlanPage from './pages/plan-page';
import ApiTest from './components/features/dashboard/api-test';
import ClarificationPage from './pages/clarification-page';
import WorkspacePage from './pages/workspace-page';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clarify" element={<ClarifyPage />} />
          <Route path="/clarify-new" element={<ClarificationPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          {/* Redirect to workspace for now */}
          <Route path="/start" element={<Navigate to="/workspace" />} />
          <Route path="/execution" element={<Navigate to="/workspace" />} />
          <Route path="/summary" element={<Navigate to="/workspace" />} />
          <Route path="/recycle" element={<Navigate to="/workspace" />} />
          <Route path="/focus" element={<Navigate to="/workspace" />} />
          <Route path="*" element={<Navigate to="/workspace" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors closeButton />
    </LanguageProvider>
  );
}

export default App;
