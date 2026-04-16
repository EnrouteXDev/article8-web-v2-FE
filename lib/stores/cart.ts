import { create } from 'zustand'
import Cookies from 'js-cookie'

const COOKIE_KEY = 'cart_session'

interface CartStore {
  sessionId: string | null
  setSessionId: (id: string) => void
  clearSessionId: () => void
}

export const useCartStore = create<CartStore>(() => ({
  sessionId: Cookies.get(COOKIE_KEY) ?? null,
  setSessionId: (id) => {
    Cookies.set(COOKIE_KEY, id, { expires: 7 })
    useCartStore.setState({ sessionId: id })
  },
  clearSessionId: () => {
    Cookies.remove(COOKIE_KEY)
    useCartStore.setState({ sessionId: null })
  },
}))
