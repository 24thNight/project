import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './lib/language-context';
import { Toaster } from 'sonner';
import DashboardPage from './pages/dashboard-page';
import ClarifyPage from './pages/clarify-page';
import PlanPage from './pages/plan-page';
import ApiTest from './components/features/dashboard/api-test';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clarify" element={<ClarifyPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/api-test" element={<ApiTest />} />
          {/* Redirect to dashboard for now, these pages would be implemented later */}
          <Route path="/start" element={<Navigate to="/dashboard" />} />
          <Route path="/execution" element={<Navigate to="/dashboard" />} />
          <Route path="/summary" element={<Navigate to="/dashboard" />} />
          <Route path="/recycle" element={<Navigate to="/dashboard" />} />
          <Route path="/focus" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors closeButton />
    </LanguageProvider>
  );
}

export default App;
