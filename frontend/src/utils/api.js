const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://modern-cart.onrender.com').replace(/\/$/, '')

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`