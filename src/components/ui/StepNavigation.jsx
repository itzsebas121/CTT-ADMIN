import { CheckIcon } from '@heroicons/react/24/outline';

/**
 * Componente de navegación por pasos reutilizable
 * 
 * @param {number} currentStep - Paso actual (1-indexed)
 * @param {function} onStepChange - Callback al cambiar de paso
 * @param {Array} steps - Array de objetos con {name, description} para cada paso
 * @param {string} accentColor - Color principal (opcional, por defecto '#6C1313')
 * @param {boolean} clickable - Si los pasos son clickeables (opcional, por defecto true)
 */
export default function StepNavigation({ 
  currentStep, 
  onStepChange, 
  steps = [], 
  accentColor = '#6C1313',
  clickable = true 
}) {
  const handleStepClick = (stepNumber) => {
    if (clickable && onStepChange) {
      onStepChange(stepNumber);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <button
                onClick={() => handleStepClick(stepNumber)}
                disabled={!clickable}
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-semibold transition-all flex-shrink-0 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                } ${clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                style={isActive ? { backgroundColor: accentColor } : {}}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </button>
              
              <div className="ml-3 flex-1 min-w-0">
                <p 
                  className={`text-xs md:text-sm font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  }`}
                  style={isActive ? { color: accentColor } : {}}
                >
                  Paso {stepNumber}
                </p>
                <p className={`text-xs truncate ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step.name || step}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 truncate hidden lg:block">
                    {step.description}
                  </p>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={`hidden md:block h-0.5 flex-1 mx-4 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
