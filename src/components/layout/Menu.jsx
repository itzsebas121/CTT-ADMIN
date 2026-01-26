import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { dashboardMenuItems } from '../../constants/navigation'
import { clearAuthData, getUserData } from '../../utils/auth'
import { ConfirmDialog } from '../ui'
import { toast } from 'react-toastify'
import {
  AcademicCapIcon,
  BookOpenIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  HomeIcon,
  Squares2X2Icon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const iconMap = {
  AcademicCapIcon,
  BookOpenIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  HomeIcon,
  Squares2X2Icon
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Auto-expand menu based on current path
    const newOpenSubmenus = {}
    dashboardMenuItems.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(subItem => location.pathname.startsWith(subItem.path))
        if (isActive) {
          newOpenSubmenus[item.path] = true
        }
      }
    })
    setOpenSubmenus(prev => ({ ...prev, ...newOpenSubmenus }))
  }, [location.pathname])

  const toggleSubmenu = (path) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  useEffect(() => {
    const userData = getUserData()
    setUser(userData)
  }, [])

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    clearAuthData()
    setShowLogoutConfirm(false)
    toast.success('Sesión cerrada exitosamente', {
      position: "top-right",
      autoClose: 2000,
    })
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }


  return (
    <>
      {/* Botón hamburguesa - solo visible en pantallas pequeñas y medianas */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay - solo visible cuando el menú está abierto en móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú lateral */}
      <aside className={`
        w-64 bg-gradient-to-b from-primary to-primary-active text-white flex flex-col
        fixed lg:static inset-y-0 left-0 z-40 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Encabezado del panel */}
        <div className="p-4 text-xl font-bold border-b border-white">
          Panel Administrativo
        </div>

        {/* Menú dinámico */}
        {/* Menú dinámico */}
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {dashboardMenuItems.map((item, index) => {
            const Icon = item.icon ? iconMap[item.icon] : null;
            return (
              <div key={item.path} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {item.subItems ? (
                  <div className="space-y-1">
                    {/* Item con subsecciones */}
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      className="w-full flex items-center justify-between px-3 py-2 text-white/90 font-bold uppercase text-xs tracking-wider hover:bg-white/10 rounded-lg transition-colors group !bg-transparent !border-none cursor-pointer"
                    >
                      <div className="flex items-center">
                        {Icon && <Icon className="w-5 h-5 mr-2 opacity-70" />}
                        {item.name}
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${openSubmenus[item.path] ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Subsecciones */}
                    <div className={`ml-2 space-y-1 border-l-2 border-white/10 pl-2 overflow-hidden transition-all duration-300 ${openSubmenus[item.path] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon ? iconMap[subItem.icon] : null;
                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-2 rounded-lg transition-all duration-300 group
                              ${isActive
                                ? "bg-white/15 text-white font-semibold shadow-sm backdrop-blur-sm translate-x-1"
                                : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`
                            }
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />}
                            <span className="text-sm">{subItem.name}</span>
                          </NavLink>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  /* Items sin subsecciones */
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg transition-all duration-300 group mb-2
                      ${isActive
                        ? "bg-white/15 text-white font-semibold shadow-sm backdrop-blur-sm translate-x-1"
                        : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`
                    }
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        {/* Información del usuario */}
        {user && (
          <div className="p-4 border-t border-white/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.username || user.firstname + " " + user.lastname || 'Usuario'}
                </p>
                <p className="text-xs text-white/80 truncate">
                  {user.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t border-white/30">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors duration-200 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Diálogo de confirmación de cierre de sesión */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="¿Cerrar sesión?"
        message="Estás a punto de cerrar tu sesión. ¿Deseas continuar?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  )
}
