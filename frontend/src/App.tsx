import { useEffect } from 'react'

import { AppRouter } from '@/routes/AppRouter'
import { useAuthStore } from '@/store/authStore'

export default function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <AppRouter />
}
