import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/global.css';
import { SanityProvider } from './providers/SanityProvider'


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <SanityProvider>
    <App />
    </SanityProvider>

)
