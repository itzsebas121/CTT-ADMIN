import { PhotoIcon } from "@heroicons/react/24/outline";

export default function StepImages({ banner, detail, onChangeImage, validationErrors = {} }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner Image (16:9) */}
        <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
              Imagen de Portada (Banner) <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Proporción 16:9 recomendada (1280 × 720 px para el catálogo).
            </p>
          </div>

          <div
            className={`w-full aspect-video rounded-lg border flex items-center justify-center overflow-hidden transition-colors ${
              banner
                ? 'bg-black/5 dark:bg-white/5 border-black/[0.08] dark:border-white/10'
                : 'bg-zinc-100 dark:bg-white/[0.04] border-dashed border-zinc-300 dark:border-white/20'
            } ${validationErrors.course_image ? 'border-red-500 ring-1 ring-red-300' : ''}`}
          >
            {banner ? (
              <img src={banner} alt="Preview banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-500">
                <PhotoIcon className="w-7 h-7 mb-1" />
                <span className="text-[11px]">Sin imagen seleccionada</span>
              </div>
            )}
          </div>

          <div>
            <label className="inline-block w-full">
              <span className="sr-only">Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChangeImage('course_image', e.target.files?.[0])}
                className="block w-full text-xs text-zinc-600 dark:text-zinc-400
                  file:mr-2.5 file:py-1.5 file:px-3
                  file:rounded-lg file:border-0
                  file:text-xs file:font-medium
                  file:bg-[#00345e] file:text-white
                  hover:file:bg-[#002747]
                  dark:file:bg-blue-600 dark:hover:file:bg-blue-700
                  file:cursor-pointer cursor-pointer"
              />
            </label>
            {validationErrors.course_image && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-medium">{validationErrors.course_image}</p>
            )}
          </div>
        </div>

        {/* Detail Image */}
        <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
              Imagen de Detalle / Afiche <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Formato vertical o cuadrado para la ficha de inscripción.
            </p>
          </div>

          <div
            className={`w-full aspect-video md:aspect-[4/3] rounded-lg border flex items-center justify-center overflow-hidden transition-colors ${
              detail
                ? 'bg-black/5 dark:bg-white/5 border-black/[0.08] dark:border-white/10'
                : 'bg-zinc-100 dark:bg-white/[0.04] border-dashed border-zinc-300 dark:border-white/20'
            } ${validationErrors.course_image_detail ? 'border-red-500 ring-1 ring-red-300' : ''}`}
          >
            {detail ? (
              <img src={detail} alt="Preview detalle" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-500">
                <PhotoIcon className="w-7 h-7 mb-1" />
                <span className="text-[11px]">Sin imagen seleccionada</span>
              </div>
            )}
          </div>

          <div>
            <label className="inline-block w-full">
              <span className="sr-only">Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChangeImage('course_image_detail', e.target.files?.[0])}
                className="block w-full text-xs text-zinc-600 dark:text-zinc-400
                  file:mr-2.5 file:py-1.5 file:px-3
                  file:rounded-lg file:border-0
                  file:text-xs file:font-medium
                  file:bg-[#00345e] file:text-white
                  hover:file:bg-[#002747]
                  dark:file:bg-blue-600 dark:hover:file:bg-blue-700
                  file:cursor-pointer cursor-pointer"
              />
            </label>
            {validationErrors.course_image_detail && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-medium">{validationErrors.course_image_detail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
