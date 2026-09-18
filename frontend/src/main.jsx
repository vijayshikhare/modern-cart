import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import './index.css' // Assume you have this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ 
      v7_startTransition: true, // Opt-in to v7 state update wrapping
      v7_relativeSplatPath: true // Opt-in to v7 splat route resolution
    }}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)