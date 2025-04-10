import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/user.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
    <AppRoutes/>
    </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
