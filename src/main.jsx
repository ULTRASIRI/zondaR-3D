import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useGLTF } from '@react-three/drei'
import App from './App.jsx'
import { MODEL_PATH } from './config.js'
import { extendGltfLoader } from './utils/extendGltfLoader.js'
import './index.css'

useGLTF.preload(MODEL_PATH, true, true, extendGltfLoader)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
