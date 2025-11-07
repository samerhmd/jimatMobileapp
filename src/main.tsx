import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import { LoginPage } from './pages/LoginPage.tsx'
import { Protected } from './routes/Protected.tsx'
import ClassesPage from './pages/ClassesPage.tsx'
import MyClassesPage from './pages/MyClassesPage.tsx'
import WODPage from './pages/WODPage.tsx'
import InvoicesPage from './pages/InvoicesPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import HealthPage from './pages/HealthPage.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route element={<Protected />}>
            <Route path="/" element={<Navigate to="/classes" replace />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/my-classes" element={<MyClassesPage />} />
            <Route path="/wod" element={<WODPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
)
