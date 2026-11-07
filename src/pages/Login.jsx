import { useState, useEffect } from "react"
import { login } from "../api/auth"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { isAuthenticated, saveAuthData } from '../utils/auth'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await login(email, password)

      if (response.access_token) {
        saveAuthData(response.access_token)
      }
      toast.success('¡Inicio de sesión exitoso! Bienvenido al panel', {
        position: "top-right",
        autoClose: 2000,
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
    } catch (error) {
      const msg = error.message || 'Error al iniciar sesión. Verifica tus credenciales'
      setErrorMessage(msg)
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/fisei.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro sobre el fondo */}
      <div
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-[4px]"
        aria-hidden="true"
      />

      {/* Tarjeta de Login limpia y elegante */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-7 sm:p-8 transition-all duration-200">
        
        {/* Logo integrado: sin bordes ni recuadro, fundido con el blanco de la tarjeta */}
        <div className="text-center mb-5">
          <img
            alt="Logo CTT - Talleres Tecnológicos"
            src="/logoCTT.webp"
            className="h-16 w-auto object-contain mx-auto mix-blend-multiply"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-3 bg-primary/10 text-primary border border-primary/20">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>Acceso Administrativo</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Panel de Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de Cursos y Talleres CTT - FISEI
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uta.edu.ec"
                required
                className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-150 outline-none focus:bg-white focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full pl-10 pr-11 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-150 outline-none focus:bg-white focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
                style={{ backgroundColor: 'transparent', border: 'none' }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botón Principal */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm border-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : (
                'Ingresar al panel'
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Facultad de Ingeniería en Sistemas, Electrónica e Industrial · UTA
          </p>
        </div>
      </div>
    </div>
  )
}
