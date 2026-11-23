import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { login as loginRequest, logout as logoutRequest, me } from '@/features/auth/api/auth'
import type { Usuario } from '@/features/auth/types/auth.types'

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await loginRequest(username, password)
        set({ usuario: await me() })
      },

      logout: async () => {
        try {
          await logoutRequest()
        } finally {
          set({ usuario: null })
        }
      },

      checkSession: async () => {
        try {
          set({ usuario: await me() })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
