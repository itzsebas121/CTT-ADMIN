import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function StepSessions({
  sessions,
  onAddSession,
  onRemoveSession,
  onSessionChange,
  availableSpeakers,
  formData,
  validationErrors = {},
}) {
  return (
    <div className="space-y-5">
      {/* Encabezado limpio y directo sin cápsulas decorativas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Cronograma y Sesiones Académicas
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Organiza las conferencias magistrales, paneles de discusión y ponencias del evento.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00345e] hover:bg-[#002747] text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0 border-0"
        >
          <PlusIcon className="w-4 h-4 stroke-[2.5]" />
          <span>Agregar Sesión</span>
        </button>
      </div>

      {/* Nota informativa sutil */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs">
        <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <div className="leading-relaxed text-[11px] sm:text-xs">
          <span>
            Las sesiones deben programarse entre el{" "}
            <strong>{formData.fecha_inicio || "inicio"}</strong> y el{" "}
            <strong>{formData.fecha_fin || "cierre"}</strong> del congreso. Si no registras sesiones ahora, podrás añadirlas posteriormente en cualquier momento.
          </span>
        </div>
      </div>

      {/* Lista Dinámica de Sesiones */}
      {sessions && sessions.length > 0 ? (
        <div className="space-y-3.5">
          {sessions.map((sess, index) => {
            const hasError = validationErrors[`session_${index}`];

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all p-3.5 sm:p-4 bg-zinc-50/60 dark:bg-white/[0.02] shadow-2xs ${
                  hasError
                    ? "border-red-500/80"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15]"
                }`}
              >
                {/* Cabecera de la Tarjeta de Sesión */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#00345e] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Sesión #{index + 1}
                    </span>

                    {/* Selector de Jornada compacto */}
                    <div className="flex rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#121215] p-0.5 ml-2">
                      {["mañana", "tarde", "noche"].map((jornada) => (
                        <button
                          key={jornada}
                          type="button"
                          onClick={() => onSessionChange(index, "jornada", jornada)}
                          className={`px-2 py-0.5 text-[10px] font-medium rounded capitalize transition-colors cursor-pointer ${
                            (sess.jornada || "mañana").toLowerCase() === jornada
                              ? "bg-[#00345e] text-white"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          {jornada}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveSession(index)}
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Eliminar esta sesión"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Eliminar</span>
                  </button>
                </div>

                {/* Formulario en Cuadrícula de 2 Columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {/* Título de la Sesión */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Título de la Conferencia / Ponencia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sess.titulo_sesion || ""}
                      onChange={(e) => onSessionChange(index, "titulo_sesion", e.target.value)}
                      maxLength={200}
                      placeholder="Ej: Nuevas Fronteras en Computación Cuántica y Criptografía Poscuántica"
                      className="w-full h-9 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                    />
                  </div>

                  {/* Ponente Asignado */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Ponente Asignado <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={sess.id_speaker || ""}
                        onChange={(e) => onSessionChange(index, "id_speaker", e.target.value)}
                        className="w-full h-9 pl-8 pr-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all cursor-pointer"
                      >
                        <option value="">Selecciona un ponente...</option>
                        {availableSpeakers.map((spk) => (
                          <option
                            key={spk.id_speaker || spk.id}
                            value={spk.id_speaker || spk.id}
                          >
                            {spk.nombres_completos || spk.nombre}{" "}
                            {spk.institucion ? `(${spk.institucion})` : ""}{" "}
                            {spk.pais ? `— ${spk.pais}` : ""}
                          </option>
                        ))}
                      </select>
                      <UserIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Lugar / Sala */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Lugar / Sala / Auditorio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={sess.lugar || ""}
                        onChange={(e) => onSessionChange(index, "lugar", e.target.value)}
                        maxLength={150}
                        placeholder="Ej: Auditorio Bloque 1 - Campus Huachi"
                        className="w-full h-9 pl-8 pr-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                      />
                      <MapPinIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Fecha de la Sesión */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Fecha de la Sesión <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={sess.fecha || ""}
                        min={formData.fecha_inicio || undefined}
                        max={formData.fecha_fin || undefined}
                        onChange={(e) => onSessionChange(index, "fecha", e.target.value)}
                        className="w-full h-9 pl-8 pr-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                      />
                      <CalendarDaysIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Horario (Inicio y Fin) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Hora Inicio
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={sess.hora_inicio || "09:00"}
                          onChange={(e) => onSessionChange(index, "hora_inicio", e.target.value)}
                          className="w-full h-9 pl-7 pr-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                        />
                        <ClockIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Hora Fin
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={sess.hora_fin || "10:30"}
                          onChange={(e) => onSessionChange(index, "hora_fin", e.target.value)}
                          className="w-full h-9 pl-7 pr-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
                        />
                        <ClockIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío Limpio */
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-black/[0.12] dark:border-white/[0.12] bg-zinc-50/40 dark:bg-white/[0.01]">
          <CalendarDaysIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Sin sesiones agendadas todavía
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
            Puedes configurar las conferencias magistrales y horarios del congreso ahora, o agregarlas luego de registrar el evento.
          </p>
          <button
            type="button"
            onClick={onAddSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#00345e] hover:bg-[#002747] text-white shadow-2xs transition-colors cursor-pointer border-0"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>Agregar Primera Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}

