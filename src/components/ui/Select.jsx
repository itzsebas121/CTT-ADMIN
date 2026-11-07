import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useDashboardTheme } from '../../context/DashboardThemeContext'

export default function Select({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Seleccionar", 
  className = "",
  width = "w-full"
}) {
  const { isDark } = useDashboardTheme();

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
            <Listbox.Button className={`relative w-full cursor-pointer rounded-lg py-2 pl-3.5 pr-9 text-left border transition-all duration-200 outline-none text-xs ${
              isDark
                ? `bg-[#16161a] border-white/[0.08] text-zinc-100 ${open ? 'border-[#00345e] ring-1 ring-[#00345e]/40' : 'hover:border-white/20'}`
                : `bg-white border-zinc-200 text-zinc-900 shadow-xs ${open ? 'border-[#00345e] ring-1 ring-[#00345e]/40' : 'hover:border-zinc-300'}`
            }`}>
              <span className={`block truncate font-medium ${!selectedOption ? (isDark ? 'text-zinc-500' : 'text-zinc-400') : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>
                {displayValue || placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                <ChevronUpDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    open ? 'rotate-180 text-[#00345e]' : (isDark ? 'text-zinc-500' : 'text-zinc-400')
                  }`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Listbox.Options 
              anchor="bottom start"
              transition
              className={`z-[9999] w-[var(--button-width)] mt-1.5 max-h-60 overflow-auto rounded-xl py-1.5 text-xs shadow-2xl border outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 origin-top ${
                isDark
                  ? 'bg-[#1a1a1f] border-white/10 text-zinc-200'
                  : 'bg-white/95 backdrop-blur-xl border-zinc-200 text-zinc-900 ring-1 ring-black/5'
              }`}
            >
              <div className="px-1 space-y-0.5">
                {options.map((option, personIdx) => {
                  const optValue = typeof option === 'object' ? option.value : option;
                  const optLabel = typeof option === 'object' ? option.label : option;
                  
                  return (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-8 rounded-lg transition-colors text-xs ${
                          selected
                            ? isDark
                              ? 'bg-[#00345e]/40 text-blue-300 font-semibold'
                              : 'bg-[#00345e]/10 text-[#00345e] font-semibold'
                            : active
                              ? isDark
                                ? 'bg-white/[0.06] text-white'
                                : 'bg-zinc-100 text-zinc-900'
                              : isDark
                                ? 'text-zinc-300'
                                : 'text-zinc-700'
                        }`
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
                            <span className={`absolute inset-y-0 right-0 flex items-center pr-2.5 ${
                              isDark ? 'text-blue-400' : 'text-[#00345e]'
                            }`}>
                              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
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
