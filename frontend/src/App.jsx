import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Statistiche from './pages/Statistiche'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Statistiche" element={<Statistiche />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
