import axios from 'axios'

import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  timeout: 10000,
  withCredentials: true,
})

const RUTAS_DE_AUTH = ['/auth/token', '/auth/me']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta))

    if (error.response?.status === 401 && !esDeAuth) {
      useAuthStore.setState({ usuario: null })
    }

    return Promise.reject(error)
  },
)
