import { useBannerForm } from '../hooks/useBannerForm';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StepNavigation } from '../components/ui';

export default function ConfiguracionHome() {
  const {
    currentStep,
    loading,
    loadingData,
    banner1,
    banner2,
    banner3,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    updateBanner1Field,
    updateBanner1Boton,
    updateBanner1Imagen,
    addBanner1Image,
    removeBanner1Image,
    updateBanner2Field,
    updateBanner2Boton,
    addBanner2Image,
    removeBanner2Image,
    updateBanner3Field,
    updateBanner3Boton,
    addBanner3Image,
    removeBanner3Image,
  } = useBannerForm();

  // Indicador de pasos
  const steps = [
    { name: 'Banner Principal', description: 'Configuración del banner hero' },
    { name: 'Banner Secundario', description: 'Sección de contenido destacado' },
    { name: 'Banner Terciario', description: 'Información adicional' },
  ];

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Home</h1>
        <p className="mt-2 text-gray-600">Administra los banners principales de la página de inicio</p>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className="inline-flex items-center">
            Los campos marcados con <span className="text-red-500 mx-1">*</span> son obligatorios
          </span>
        </div>
      </div>

      {/* Stepper */}
      <StepNavigation 
        currentStep={currentStep}
        onStepChange={goToStep}
        steps={steps}
        clickable={true}
      />

      {/* Formulario por pasos */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* Banner 1 - Principal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Banner Principal (Hero)</h2>
              <p className="text-sm text-gray-500 mt-1">Banner principal que se muestra al entrar al sitio</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={banner1.subtitulo}
                  onChange={(e) => updateBanner1Field('subtitulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Generamos desarrollo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={banner1.titulo}
                  onChange={(e) => updateBanner1Field('titulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Centro de transferencia CTT"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Botón <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={banner1.boton.texto}
                    onChange={(e) => updateBanner1Boton('texto', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Conocer más"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace del Botón <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={banner1.boton.direccion}
                    onChange={(e) => updateBanner1Boton('direccion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: /cursos o https://..."
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    <PhotoIcon className="inline h-5 w-5 mr-1" />
                    Imágenes del Banner <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addBanner1Image}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Agregar Imagen
                  </button>
                </div>
                
                <div className="space-y-4">
                  {banner1.imagenes.map((img, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Imagen {index + 1} <span className="text-red-500">*</span>
                        </span>
                        {banner1.imagenes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBanner1Image(index)}
                            className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Eliminar
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={img.imagen}
                        onChange={(e) => updateBanner1Imagen(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                      {img.imagen && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                          <img 
                            src={img.imagen} 
                            alt={`Preview ${index + 1}`}
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible'}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner 2 - Secundario */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Banner Secundario</h2>
                  <p className="text-sm text-gray-500 mt-1">Sección de contenido destacado con múltiples imágenes</p>
                </div>
                <button
                  type="button"
                  onClick={addBanner2Image}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Agregar Imagen
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {banner2.imagenes.map((img, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Imagen {index + 1}</h3>
                    {banner2.imagenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBanner2Image(index)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhotoIcon className="inline h-5 w-5 mr-1" />
                        URL de la Imagen <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={img.imagen}
                        onChange={(e) => updateBanner2Field(index, 'imagen', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                      {img.imagen && (
                        <div className="mt-3">
                          <img 
                            src={img.imagen} 
                            alt={`Preview ${index + 1}`}
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible'}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={img.titulo}
                        onChange={(e) => updateBanner2Field(index, 'titulo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Conocimiento"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={img.subtitulo}
                        onChange={(e) => updateBanner2Field(index, 'subtitulo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Generamos desarrollo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={img.descripcion}
                        onChange={(e) => updateBanner2Field(index, 'descripcion', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descripción del banner..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto del Botón <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={img.boton?.texto || ''}
                          onChange={(e) => updateBanner2Boton(index, 'texto', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Ver más"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enlace del Botón <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={img.boton?.direccion || ''}
                          onChange={(e) => updateBanner2Boton(index, 'direccion', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: /nosotros"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner 3 - Terciario */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Banner Terciario</h2>
                  <p className="text-sm text-gray-500 mt-1">Sección adicional de información con múltiples imágenes</p>
                </div>
                <button
                  type="button"
                  onClick={addBanner3Image}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Agregar Imagen
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {banner3.imagenes.map((img, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Imagen {index + 1}</h3>
                    {banner3.imagenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBanner3Image(index)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhotoIcon className="inline h-5 w-5 mr-1" />
                        URL de la Imagen <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={img.imagen}
                        onChange={(e) => updateBanner3Field(index, 'imagen', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                      {img.imagen && (
                        <div className="mt-3">
                          <img 
                            src={img.imagen} 
                            alt={`Preview ${index + 1}`}
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible'}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={img.titulo}
                        onChange={(e) => updateBanner3Field(index, 'titulo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Generando conocimiento"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={img.subtitulo}
                        onChange={(e) => updateBanner3Field(index, 'subtitulo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Impulsa tus habilidades"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={img.descripcion}
                        onChange={(e) => updateBanner3Field(index, 'descripcion', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descripción del banner..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto del Botón <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={img.boton?.texto || ''}
                          onChange={(e) => updateBanner3Boton(index, 'texto', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Conocer más"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enlace del Botón <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={img.boton?.direccion || ''}
                          onChange={(e) => updateBanner3Boton(index, 'direccion', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: /contacto"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex items-center justify-between pt-6 border-t mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={`inline-flex items-center px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors
              ${currentStep === 1 || loading
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Anterior
          </button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-900">
              Paso {currentStep} de {steps.length}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {steps[currentStep - 1].name}
            </span>
          </div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
