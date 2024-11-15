import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ToastContainer/>
  <BrowserRouter>
  <AuthContextProvider>
  <App />
  </AuthContextProvider>
 
  
  </BrowserRouter>
  {/* </ToastContainer> */}
  
  </StrictMode>,
)
