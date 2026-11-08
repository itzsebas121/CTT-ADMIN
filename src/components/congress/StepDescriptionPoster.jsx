import { useState } from "react";
import {
  PhotoIcon,
  LinkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function StepDescriptionPoster({
  formData,
  onChange,
  posterFile,
  posterPreview,
  onPosterChange,
  uploadingPoster,
  validationErrors = {},
  targetAudiences = [],
  onAddAudience,
  onRemoveAudience,
  onChangeAudience,
}) {
  const [useUrlMode, setUseUrlMode] = useState(!posterFile && Boolean(formData.poster_cover_url));

  return (
    <div className="space-y-5">
      {/* Encabezado directo y limpio */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          Descripción y Material Gráfico
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Redacta el alcance del congreso, su público objetivo y sube el afiche oficial de difusión.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* Columna Izquierda: Descripción y Público Objetivo */}
        <div className="space-y-4">
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Contenido Académico y Alcance
            </h3>

            {/* Descripción General */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Descripción General del Congreso <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-zinc-400">
                  {formData.descripcion_general?.length || 0}/1500
                </span>
              </div>
              <textarea
                name="descripcion_general"
                rows={6}
                value={formData.descripcion_general}
                onChange={onChange}
                maxLength={1500}
                placeholder="Describe el propósito del congreso, conferencias magistrales, llamado a presentación de artículos científicos, comités organizadores y los impactos para la comunidad universitaria y profesional..."
                className={`w-full p-3 rounded-lg border text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-all resize-none ${
                  validationErrors.descripcion_general
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black/[0.08] dark:border-white/[0.08] focus:ring-[#00345e] dark:focus:ring-blue-400"
                }`}
              />
              {validationErrors.descripcion_general && (
                <p className="text-[11px] text-red-500 mt-1">
                  {validationErrors.descripcion_general}
                </p>
              )}
            </div>

            {/* Público Objetivo Dinámico */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Público Objetivo y Participantes
                  </label>
                  <p className="text-[10px] text-zinc-400">
                    Perfiles a los que está orientada la convocatoria académica.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddAudience}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-[#e6f3fe] dark:bg-[#00345e]/30 text-[#00345e] dark:text-blue-300 hover:bg-[#d6ebfd] dark:hover:bg-[#00345e]/50 transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3 h-3 stroke-[2.5]" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {targetAudiences && targetAudiences.length > 0 ? (
                  targetAudiences.map((aud, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-[11px] font-medium text-zinc-400 text-center shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={aud}
                        onChange={(e) => onChangeAudience(idx, e.target.value)}
                        placeholder={`Perfil ${idx + 1} (Ej: Estudiantes de pregrado y posgrado)`}
                        className="flex-1 h-8 px-2.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveAudience(idx)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Eliminar perfil"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic py-2 text-center border border-dashed border-black/[0.08] dark:border-white/[0.08] rounded-lg">
                    Sin perfiles asignados. Pulsa en "Agregar" para registrar audiencia clave.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Póster / Afiche Oficial */}
        <div className="space-y-4">
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Póster Oficial / Afiche de Portada <span className="text-red-500">*</span>
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Imagen promocional que aparecerá en el portal web y catálogo de congresos.
                </p>
              </div>

              {/* Selector de modo: Archivo vs URL */}
              <div className="flex rounded-lg border border-black/[0.08] dark:border-white/[0.08] p-0.5 bg-zinc-100 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setUseUrlMode(false)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                    !useUrlMode
                      ? "bg-white dark:bg-[#16161a] text-zinc-900 dark:text-white shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Subir
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrlMode(true)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                    useUrlMode
                      ? "bg-white dark:bg-[#16161a] text-zinc-900 dark:text-white shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Enlace
                </button>
              </div>
            </div>

            {/* Zona de Carga de Archivo */}
            {!useUrlMode ? (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/[0.12] dark:border-white/[0.12] hover:border-[#00345e] dark:hover:border-blue-400 rounded-xl p-4 cursor-pointer bg-white dark:bg-[#121215] transition-all group">
                  <ArrowUpTrayIcon className="w-7 h-7 text-zinc-400 group-hover:text-[#00345e] dark:group-hover:text-blue-400 mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-[#00345e] dark:group-hover:text-blue-300">
                    Selecciona o arrastra el afiche oficial
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    Formatos JPG, PNG o WEBP (Recomendado: 1200×630 o afiche vertical)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPosterChange}
                    className="hidden"
                  />
                </label>

                {posterFile && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <span className="truncate">Archivo listo: {posterFile.name}</span>
                    <span className="text-[10px] font-semibold uppercase">
                      {(posterFile.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Modo URL Directa */
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  URL Directa del Póster
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="poster_cover_url"
                    value={formData.poster_cover_url}
                    onChange={onChange}
                    placeholder="https://ejemplo.com/afiche-congreso.jpg"
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                  />
                  <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            )}

            {/* Vista Previa en Tiempo Real */}
            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Vista previa del afiche
              </span>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
                {posterPreview || formData.poster_cover_url ? (
                  <>
                    <img
                      src={posterPreview || formData.poster_cover_url}
                      alt="Afiche del congreso"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        {formData.edicion ? `Edición ${formData.edicion}` : "Congreso Oficial"} · {formData.anio || 2026}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold line-clamp-2">
                        {formData.nombre || "Título del Congreso UTA FISEI"}
                      </h4>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <PhotoIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-1" />
                    <p className="text-xs text-zinc-400">
                      Sin afiche seleccionado todavía. Sube un archivo o proporciona una URL.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

