import {
  CalendarDaysIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function StepGeneralData({
  formData,
  onChange,
  editionCheck,
  validationErrors = {},
  thematicTracks = [],
  onAddTrack,
  onRemoveTrack,
  onChangeTrack,
}) {
  return (
    <div className="space-y-5">
      {/* Encabezado directo y limpio sin cápsulas decorativas */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          Datos Generales del Congreso
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Estructura los datos fundamentales, edición académica y calendario oficial del evento.
        </p>
      </div>

      {/* Grid de 2 columnas para aprovechar eficientemente el espacio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* Columna Izquierda: Identificación y Fechas */}
        <div className="space-y-4">
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Identificación Oficial
            </h3>

            {/* Nombre del Congreso */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Nombre del Congreso <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-zinc-400">
                  {formData.nombre?.length || 0}/100
                </span>
              </div>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={onChange}
                maxLength={100}
                placeholder="Ej: Congreso Internacional de Tecnologías de Información y Software FISEI"
                className={`w-full h-9 px-3 rounded-lg border text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-all ${
                  validationErrors.nombre
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black/[0.08] dark:border-white/[0.08] focus:ring-[#00345e] dark:focus:ring-blue-400"
                }`}
              />
              {validationErrors.nombre && (
                <p className="text-[11px] text-red-500 mt-1">{validationErrors.nombre}</p>
              )}
            </div>

            {/* Edición y Año en dos subcolumnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Edición <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="edicion"
                    value={formData.edicion}
                    onChange={onChange}
                    maxLength={10}
                    placeholder="Ej: IX, 2026, 1ra"
                    className={`w-full h-9 px-3 pr-8 rounded-lg border text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-all ${
                      editionCheck.available === false
                        ? "border-red-500 focus:ring-red-500"
                        : editionCheck.available === true
                        ? "border-emerald-500 focus:ring-emerald-500"
                        : "border-black/[0.08] dark:border-white/[0.08] focus:ring-[#00345e] dark:focus:ring-blue-400"
                    }`}
                  />
                  <div className="absolute right-2.5 top-2.5">
                    {editionCheck.checking && (
                      <div className="w-3.5 h-3.5 border-2 border-[#00345e] dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    {!editionCheck.checking && editionCheck.available === true && (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    )}
                    {!editionCheck.checking && editionCheck.available === false && (
                      <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {editionCheck.message && (
                  <p
                    className={`text-[10px] mt-1 ${
                      editionCheck.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                    }`}
                  >
                    {editionCheck.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Año de Realización <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={onChange}
                  min={2000}
                  max={2100}
                  placeholder="2026"
                  className="w-full h-9 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Fechas: Inicio y Fin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={onChange}
                    className={`w-full h-9 px-3 rounded-lg border text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                      validationErrors.fecha_inicio
                        ? "border-red-500 focus:ring-red-500"
                        : "border-black/[0.08] dark:border-white/[0.08] focus:ring-[#00345e] dark:focus:ring-blue-400"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Fecha de Finalización <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={onChange}
                    min={formData.fecha_inicio || undefined}
                    className={`w-full h-9 px-3 rounded-lg border text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                      validationErrors.fecha_fin
                        ? "border-red-500 focus:ring-red-500"
                        : "border-black/[0.08] dark:border-white/[0.08] focus:ring-[#00345e] dark:focus:ring-blue-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Resumen rápido de duración */}
            {formData.fecha_inicio && formData.fecha_fin && formData.fecha_fin >= formData.fecha_inicio && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#00345e] dark:text-blue-300 pt-0.5">
                <CalendarDaysIcon className="w-3.5 h-3.5" />
                <span>
                  Evento programado del {formData.fecha_inicio} al {formData.fecha_fin}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Sede Principal y Ejes Temáticos Dinámicos */}
        <div className="space-y-4">
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Sede y Modalidad Académica
            </h3>

            {/* Sede / Campus */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Sede Principal / Campus Universitario
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lugar_sede"
                  value={formData.lugar_sede || ""}
                  onChange={onChange}
                  placeholder="Ej: Campus Huachi - Auditorio Central de la FISEI, Ambato"
                  className="w-full h-9 pl-8 pr-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                />
                <MapPinIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Servirá como referencia predeterminada para las salas del cronograma.
              </p>
            </div>

            {/* Ejes Temáticos / Líneas de Investigación Dinámicas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Ejes Temáticos / Líneas de Investigación
                  </label>
                  <p className="text-[10px] text-zinc-400">
                    Áreas de conocimiento que abarcan las ponencias y workshops del congreso.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddTrack}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-[#e6f3fe] dark:bg-[#00345e]/30 text-[#00345e] dark:text-blue-300 hover:bg-[#d6ebfd] dark:hover:bg-[#00345e]/50 transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3 h-3 stroke-[2.5]" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {thematicTracks && thematicTracks.length > 0 ? (
                  thematicTracks.map((track, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-[11px] font-medium text-zinc-400 text-center shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={track}
                        onChange={(e) => onChangeTrack(idx, e.target.value)}
                        placeholder={`Línea ${idx + 1} (Ej: Inteligencia Artificial, Ciberseguridad)`}
                        className="flex-1 h-8 px-2.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveTrack(idx)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Eliminar eje temático"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic py-2 text-center border border-dashed border-black/[0.08] dark:border-white/[0.08] rounded-lg">
                    Sin ejes temáticos definidos. Haz clic en "Agregar" para incorporar áreas académicas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

