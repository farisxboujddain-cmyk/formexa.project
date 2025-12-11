import axios from 'axios'

const API_BASE = '/api'

const client = axios.create({ baseURL: API_BASE })

// Attach token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email, password, name) =>
    client.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    client.post('/auth/login', { email, password })
}

export const aiAPI = {
  generateArticle: (prompt, title, saveProject) =>
    client.post('/ai/generate-article', { prompt, title, saveProject }),
  generateImage: (prompt, size, saveProject) =>
    client.post('/ai/generate-image', { prompt, size, saveProject }),
  generateCode: (prompt, language, saveProject) =>
    client.post('/ai/generate-code', { prompt, language, saveProject })
}

export const paypalAPI = {
  createSubscription: (plan, billingCycle) =>
    client.post('/paypal/create-subscription', { plan, billingCycle }),
  getStatus: () => client.get('/paypal/status'),
  cancel: () => client.post('/paypal/cancel')
}

export const projectsAPI = {
  list: (type, limit, skip) =>
    client.get('/projects', { params: { type, limit, skip } }),
  get: (id) => client.get(`/projects/${id}`),
  update: (id, data) => client.put(`/projects/${id}`, data),
  delete: (id) => client.delete(`/projects/${id}`)
}

export const userAPI = {
  getProfile: () => client.get('/user/profile'),
  updateProfile: (data) => client.put('/user/profile', data),
  getStats: () => client.get('/user/stats')
}
