import { DocumentMagnifyingGlassIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import ItemHeader from '../ui/ItemHeader'

const navigation = [
  { id: 0, title: 'Verifica Tu Certificado', href: 'Ingresa aquí', icon: DocumentMagnifyingGlassIcon },
  { id: 1, title: 'Plataforma Educativa', href: 'Ingresa aquí', icon: ComputerDesktopIcon },
]


export default function Header() {
  return (
    <>
        <header className="sticky hidden md:block top-0 w-full z-50 bg-white">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="hidden md:flex lg:flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                <img
                    alt=""
                    src="src/assets/logoUTA.webp"
                    className="h-22 w-auto"
                />
                </a>
            </div>
            <div className="hidden md:flex md:gap-x-0 lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                    <ItemHeader key={item.id} item={item} />
                ))}
            </div>
            <div className=" lg:flex lg:flex-1 lg:justify-end">
                <a href="#" className="-m-1.5 p-1.5">
                <img
                    alt=""
                    src="src/assets/logoCTT.webp"
                    className="h-22 w-auto "
                />
                </a>
            </div>
            <div className=" flex flex-1 lg:hidden md:hidden pl-10">
                <a href="#" className="-m-1.5 p-1.5">
                <img
                    alt=""
                    src="src/assets/logoUTAPequeño.png"
                    className="h-15 w-auto min-w-30"
                />
                </a>
            </div>
            </nav>
        </header>
    </>
  )
}
