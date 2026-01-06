import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cursos from './pages/Cursos.jsx'
import CourseDetail from './pages/courses/CourseDetail.jsx'
import FormCourse from './pages/courses/FormCourse.jsx'
import Estudiantes from './pages/Estudiantes.jsx'
import ConfiguracionHome from './pages/ConfiguracionHome.jsx'
import { isAuthenticated } from './utils/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


// Componente para proteger rutas (solo entra si hay token)
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Página pública */}
        <Route path="/login" className="h-screen" element={<Login/>} />

        {/* Rutas privadas dentro del dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
          
        >
          <Route index element={<Navigate to="cursos" replace />} />  
          <Route path="cursos" element={<Cursos />} />
          <Route path="cursos/:id" element={<CourseDetail />} />
          <Route path="cursos/:id/editar" element ={<FormCourse />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="configuracion/home" element={<ConfiguracionHome />} />
          {/* Otras rutas privadas pueden ir aquí */}
        </Route>
        {/* Redirigir raíz al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
