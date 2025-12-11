import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isLoggedIn: !!localStorage.getItem('authToken'),
  
  login: (token, user) => {
    localStorage.setItem('authToken', token)
    set({ token, user, isLoggedIn: true })
  },
  
  logout: () => {
    localStorage.removeItem('authToken')
    set({ token: null, user: null, isLoggedIn: false })
  },
  
  setUser: (user) => set({ user })
}))

export const useSubscriptionStore = create((set) => ({
  subscription: null,
  plan: 'free',
  status: 'inactive',
  usage: { articles: 0, images: 0, code: 0 },
  limits: { articles: 5, images: 2, code: 5 },
  
  setSubscription: (subscription) => set(subscription),
  updateUsage: (type) => set((state) => ({
    usage: { ...state.usage, [type]: state.usage[type] + 1 }
  }))
}))

export const useProjectsStore = create((set) => ({
  projects: [],
  loading: false,
  
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  }))
}))
