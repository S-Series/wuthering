import { reactive, computed } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

const state = reactive({
  toasts: [] as Toast[]
})

let nextId = 0

export function useToast() {
  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = nextId++
    const toast: Toast = { id, message, type, duration }
    state.toasts.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: number) => {
    const index = state.toasts.findIndex(t => t.id === id)
    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  }

  return {
    toasts: computed(() => state.toasts),
    addToast,
    removeToast
  }
}
