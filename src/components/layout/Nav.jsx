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
      <nav aria-label="Global" className="sticky top-0 shadow-lg md:top-40 lg:top-30 z-50 w-full flex items-center justify-between p-6 lg:px-8 bg-[#FFFFFF] md:bg-[#6C1313] lg:bg-[#6C1313]">
        <div className="lg:flex md:flex hidden lg:gap-x-12 md:gap-x-12 gap-4 lg:pl-30 md:pl-20">
          {navigation2.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                `font-semibold transition ${isActive ? "text-[#6C1313] md:text-white border-b-2 border-[#6C1313] md:border-white" : "text-gray-700 md:text-gray-200 hover:text-[#6C1313] md:hover:text-white"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="lg:hidden md:hidden  flex sm:flex sm:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              alt=""
              src="src/assets/logoCTT.webp"
              className="h-22 w-auto"
            />
          </a>
        </div>
        <div className="lg:hidden md:hidden  flex sm:flex sm:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              alt=""
              src="src/assets/logoUTAPequeño.png"
              className="h-15 w-auto min-w-30"
            />
          </a>
        </div>
        <div className="flex md:hidden lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex justify-end mb-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10" >
              <div className="space-y-2 py-12">
                {navigation2.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 font-semibold  ${isActive
                        ? "bg-[#6C1313]"
                        : "text-[#6C1313] NavLink  hover:bg-[#6C1313] "
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="border-t-1 border-[#6C1313] divide-y divide-gray-500/10" >
              <div className="space-y-2 py-6">
                {itemsHeader.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold"
                    style={{ color: '#6C1313' }}
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
