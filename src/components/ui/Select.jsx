import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

export default function Select({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Seleccionar", 
  className = "",
  width = "w-full"
}) {
  // Encuentra el objeto de la opción seleccionada o usa el valor directamente si es primitivo
  const selectedOption = options.find(opt => 
    (typeof opt === 'object' ? opt.value : opt) === value
  ) || value;

  const displayValue = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;

  return (
    <div className={`${width} ${className}`}>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Button className={`relative w-full cursor-pointer rounded-xl !bg-white py-3 pl-4 pr-10 text-left border transition-all duration-200 ${open ? 'border-primary ring-2 ring-primary/10 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'} focus:outline-none sm:text-sm text-gray-900 group`}>
              <span className={`block truncate font-medium ${!selectedOption ? 'text-gray-400' : 'text-gray-700'}`}>
                {displayValue || placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out ${open ? 'rotate-180 text-primary' : 'group-hover:text-gray-600'}`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Listbox.Options 
              anchor="bottom start"
              transition
              className="z-[9999] w-[var(--button-width)] mt-2 max-h-60 overflow-auto rounded-xl bg-white/95 backdrop-blur-xl py-2 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-100 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 origin-top"
            >
              <div className="px-1.5 space-y-0.5">
                {options.map((option, personIdx) => {
                  const optValue = typeof option === 'object' ? option.value : option;
                  const optLabel = typeof option === 'object' ? option.label : option;
                  
                  return (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2.5 pl-3 pr-9 rounded-lg transition-all duration-200 ${
                          active ? 'bg-primary/5 text-primary' : 'text-gray-700'
                        } ${selected ? 'bg-primary/10 text-primary font-semibold' : ''}`
                      }
                      value={optValue}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-semibold' : 'font-normal'
                            }`}
                          >
                            {optLabel}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary animate-fade-in">
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  )
                })}
              </div>
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  )
}
