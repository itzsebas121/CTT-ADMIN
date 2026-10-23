export default function StepImages({ banner, detail, onChangeImage, validationErrors = {} }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary">La primera impresión</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Elige las imágenes del curso</h2>
        <p className="text-sm text-slate-500 mt-2">Usa una portada horizontal y una imagen de detalle que representen la experiencia.</p>
      </div>

      {/* Banner Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Imagen de banner <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className={`w-full sm:w-64 h-auto sm:h-36 bg-slate-100 border rounded-2xl flex items-center justify-center overflow-hidden ${
            validationErrors.course_image ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
          }`}>
            {banner ? (
              <img src={banner} alt="Preview banner" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">Sin imagen</span>
            )}
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeImage('course_image', e.target.files?.[0])}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
            />
            <p className="mt-2 text-xs text-gray-500">Se mostrará como banner del curso (relación 16:9 recomendada).</p>
            {validationErrors.course_image && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.course_image}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Imagen de detalle <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className={`w-full sm:w-64 h-auto sm:h-80 bg-slate-100 border rounded-2xl flex items-center justify-center overflow-hidden ${
            validationErrors.course_image_detail ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
          }`}>
            {detail ? (
              <img src={detail} alt="Preview detalle" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">Sin imagen</span>
            )}
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeImage('course_image_detail', e.target.files?.[0])}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
            />
            <p className="mt-2 text-xs text-gray-500">Se mostrará en la vista detallada del curso (formato vertical o cuadrado).</p>
            {validationErrors.course_image_detail && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.course_image_detail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
