import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@/pages/auth/auth-page'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/register',
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
