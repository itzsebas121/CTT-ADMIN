import { Link, NavLink } from "react-router-dom"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from "react"

const navigation2 = [
  { id: 0, title: 'Home', href: '/' },
  { id: 1, title: 'Cursos', href: 'courses' },
  { id: 2, title: 'Nosotros', href: 'nosotros' },
  { id: 3, title: 'Contáctanos', href: 'contact' },
]

const itemsHeader = [
  { id: 1, title: 'Verificar Certificado', href: 'https://ctt-talleresfisei.uta.edu.ec/edu/mod/customcert/verify_certificate.php' },
  { id: 2, title: 'Plataforma Educativa', href: 'https://ctt-talleresfisei.uta.edu.ec/edu/login/index.php' },
]

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav aria-label="Global" className="sticky top-0 z-50 w-full flex items-center justify-between p-4 lg:px-8 bg-white/95 md:bg-primary/95 lg:bg-primary/95 backdrop-blur-sm shadow-md transition-all duration-300">
        <div className="lg:flex md:flex hidden lg:gap-x-12 md:gap-x-8 gap-4 items-center">
          {navigation2.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                `text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-lg ${isActive 
                  ? "text-primary md:text-white bg-primary/10 md:bg-white/20 shadow-sm" 
                  : "text-gray-600 md:text-gray-100 hover:text-primary md:hover:text-white hover:bg-gray-100/50 md:hover:bg-white/10"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="lg:hidden md:hidden flex sm:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              alt="Logo CTT"
              src="/logoCTT.webp"
              className="h-16 w-auto object-contain"
            />
          </a>
        </div>
        <div className="lg:hidden md:hidden flex sm:flex-1 justify-end">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              alt="Logo UTA"
              src="/LogoUTAPequeño.png"
              className="h-12 w-auto object-contain"
            />
          </a>
        </div>
        <div className="flex md:hidden lg:hidden ml-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-7" />
          </button>
        </div>
      </nav>
      
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl transition-transform duration-300">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
             <span className="text-lg font-bold text-gray-900">Menú</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-lg p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-2 flow-root">
            <div className="-my-6 divide-y divide-gray-100">
              <div className="space-y-2 py-6">
                {navigation2.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-base font-semibold leading-7 transition-all duration-200 ${isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
              <div className="py-6 space-y-3">
                {itemsHeader.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold leading-7 text-gray-600 hover:bg-gray-50 hover:text-primary transition-all duration-200 border border-gray-100 hover:border-gray-200"
                  >
                     {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}
