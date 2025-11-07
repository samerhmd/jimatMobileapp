import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { LoginPage } from './pages/LoginPage.tsx'
import { Protected } from './routes/Protected.tsx'
import AppShell from './components/AppShell.tsx'
import ClassesPage from './pages/ClassesPage.tsx'
import { MyClassesPage } from './pages/MyClassesPage.tsx'
import { WODPage } from './pages/WODPage.tsx'
import { InvoicesPage } from './pages/InvoicesPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Protected />}>
            <Route path="/" element={<Navigate to="/classes" replace />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route
              path="/my-classes"
              element={
                <AppShell>
                  <MyClassesPage />
                </AppShell>
              }
            />
            <Route
              path="/wod"
              element={
                <AppShell>
                  <WODPage />
                </AppShell>
              }
            />
            <Route
              path="/invoices"
              element={
                <AppShell>
                  <InvoicesPage />
                </AppShell>
              }
            />
            <Route
              path="/profile"
              element={
                <AppShell>
                  <ProfilePage />
                </AppShell>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
