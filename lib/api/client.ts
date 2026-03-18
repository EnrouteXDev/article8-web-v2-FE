import axios from 'axios'
import Cookies from 'js-cookie'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.placeholder.dev',
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token from cookie
client.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      Cookies.remove('auth_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }

    return Promise.reject(error)
  }
)

export { client }
