import axios from 'axios'

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://formexa-oazfzv2a0-farisxboujddain-cmyks-projects.vercel.app/api'
  : '/api'

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
  generateArticle: (prompt) =>
    client.post('/generate', { type: 'article', prompt }),
  generateImage: (prompt) =>
    client.post('/generate', { type: 'image', prompt }),
  generateCode: (prompt) =>
    client.post('/generate', { type: 'code', prompt })
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
