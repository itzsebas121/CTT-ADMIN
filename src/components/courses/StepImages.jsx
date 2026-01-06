export default function StepImages({ banner, detail, onChangeImage }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Imágenes del curso</h2>
      <p className="text-sm text-gray-600">
        Suba la imagen de banner y la imagen de detalle. Formatos: JPG/PNG. Tamaño recomendado 1200x400 para banner.
      </p>

      {/* Banner Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de banner</label>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-full sm:w-64 h-auto sm:h-36 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
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
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6C1313] file:text-white hover:file:bg-[#5a0f0f]"
            />
            <p className="mt-2 text-xs text-gray-500">Se mostrará como banner del curso.</p>
          </div>
        </div>
      </div>

      {/* Detail Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de detalle</label>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-full sm:w-64 h-auto sm:h-80 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
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
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6C1313] file:text-white hover:file:bg-[#5a0f0f]"
            />
            <p className="mt-2 text-xs text-gray-500">Se mostrará en la vista detallada del curso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
