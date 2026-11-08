import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function StepRequirements({
  requirementsData,
  onChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onPriceChange,
  onAddPrice,
  onRemovePrice,
  validationErrors = {}
}) {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-4">
      {/* Grid de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* COLUMNA 1: Calendario, Horarios y Modalidad */}
        <div className="space-y-3.5">
          {/* Bloque: Fechas Importantes */}
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
            <div className="pb-2 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Calendario de Fechas
              </h3>
              <span className="text-[11px] text-zinc-400">Inscripción y dictado</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Inicio Inscripción <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  value={requirementsData.start_date_registration || ''}
                  onChange={(e) => onChange('start_date_registration', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.start_date_registration
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.start_date_registration && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.start_date_registration}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Fin Inscripción <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  min={requirementsData.start_date_registration || undefined}
                  value={requirementsData.end_date_registration || ''}
                  onChange={(e) => onChange('end_date_registration', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.end_date_registration
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.end_date_registration && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.end_date_registration}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Inicio del Curso <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  value={requirementsData.start_date_course || ''}
                  onChange={(e) => onChange('start_date_course', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.start_date_course
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.start_date_course && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.start_date_course}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Fin del Curso <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  min={requirementsData.start_date_course || undefined}
                  value={requirementsData.end_date_course || ''}
                  onChange={(e) => onChange('end_date_course', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.end_date_course
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.end_date_course && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.end_date_course}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bloque: Horarios y Ubicación */}
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              Horarios y Espacio Físico
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Hora Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="time"
                  value={requirementsData.start_time || ''}
                  onChange={(e) => onChange('start_time', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.start_time
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.start_time && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.start_time}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Hora Fin <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="time"
                  value={requirementsData.end_time || ''}
                  onChange={(e) => onChange('end_time', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.end_time
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.end_time && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.end_time}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Ubicación / Aula <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requirementsData.location || ''}
                  onChange={(e) => onChange('location', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.location
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                  placeholder="Ej: Sala 301, Laboratorio FISEI"
                />
                {validationErrors.location && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bloque: Días de Clase */}
          <div className={`rounded-xl border p-4 transition-colors ${
            validationErrors.days
              ? 'border-red-400 bg-red-50/20'
              : 'border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02]'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Días de Clase <span className="text-red-500">*</span>
              </label>
              {validationErrors.days && (
                <span className="text-[11px] text-red-600 dark:text-red-400">{validationErrors.days}</span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {daysOfWeek.map((day) => {
                const isChecked = (requirementsData.days || []).includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#00345e] text-white border-[#00345e] shadow-2xs'
                        : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 border-black/[0.08] dark:border-white/[0.08] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentDays = requirementsData.days || [];
                        if (e.target.checked) {
                          onChange('days', [...currentDays, day]);
                        } else {
                          onChange('days', currentDays.filter((d) => d !== day));
                        }
                      }}
                      className="sr-only"
                    />
                    <span className={`w-3 h-3 rounded-xs flex items-center justify-center border text-[9px] ${
                      isChecked
                        ? 'bg-white text-[#00345e] border-white font-bold'
                        : 'border-zinc-300 dark:border-zinc-600 bg-transparent'
                    }`}>
                      {isChecked ? '✓' : ''}
                    </span>
                    <span className="truncate">{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bloque: Modalidad y Certificación */}
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              Modalidad y Acreditación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Modalidad <span className="text-red-500">*</span>
                </label>
                <select
                  value={requirementsData.modality || 'Presencial'}
                  onChange={(e) => onChange('modality', e.target.value)}
                  className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Certificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requirementsData.certification || ''}
                  onChange={(e) => onChange('certification', e.target.value)}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.certification
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                  placeholder="Ej: Certificado digital con QR"
                />
                {validationErrors.certification && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.certification}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: Capacidad, Tarifas y Prerrequisitos */}
        <div className="space-y-3.5">
          {/* Bloque: Capacidad y Carga Horaria */}
          <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              Capacidad y Carga Horaria
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Cupo Mínimo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={requirementsData.min_quota === '' ? '' : (requirementsData.min_quota ?? '')}
                  min="1"
                  placeholder="Ej: 10"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange('min_quota', val === '' ? '' : parseInt(val, 10));
                  }}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.min_quota
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.min_quota && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.min_quota}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Cupo Máximo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={requirementsData.max_quota === '' ? '' : (requirementsData.max_quota ?? '')}
                  min="1"
                  placeholder="Ej: 30"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange('max_quota', val === '' ? '' : parseInt(val, 10));
                  }}
                  className={`w-full bg-white dark:bg-[#121215] border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors ${
                    validationErrors.max_quota
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                />
                {validationErrors.max_quota && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{validationErrors.max_quota}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Horas Presenciales
                </label>
                <input
                  type="number"
                  value={requirementsData.in_person_hours === '' ? '' : (requirementsData.in_person_hours ?? 0)}
                  min="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange('in_person_hours', val === '' ? 0 : parseInt(val, 10));
                  }}
                  className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Horas Autónomas
                </label>
                <input
                  type="number"
                  value={requirementsData.autonomous_hours === '' ? '' : (requirementsData.autonomous_hours ?? 0)}
                  min="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange('autonomous_hours', val === '' ? 0 : parseInt(val, 10));
                  }}
                  className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bloque: Estructura de Precios */}
          <div className={`rounded-xl border p-4 transition-colors ${
            validationErrors.prices
              ? 'border-red-400 bg-red-50/20'
              : 'border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02]'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Estructura de Precios <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Tarifas en USD diferenciadas por perfil institucional.
                </p>
              </div>
              {validationErrors.prices && (
                <span className="text-[11px] text-red-600 dark:text-red-400">{validationErrors.prices}</span>
              )}
            </div>

            <div className="space-y-1.5">
              {(requirementsData.prices || []).map((price, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-24 sm:w-28 flex items-center gap-1 shrink-0">
                    <span className="text-xs font-semibold text-zinc-400 pl-0.5">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price.amount === 0 ? '' : (price.amount ?? '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        onPriceChange(i, 'amount', val === '' ? 0 : parseFloat(val));
                      }}
                      className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Categoría (Ej: Estudiantes UTA, General)"
                    value={price.category || ''}
                    onChange={(e) => onPriceChange(i, 'category', e.target.value)}
                    className="flex-1 bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                  />

                  {requirementsData.prices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemovePrice(i)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Eliminar tarifa"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onAddPrice}
              className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[#00345e] dark:text-blue-400 border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Agregar Tarifa</span>
            </button>
          </div>

          {/* Bloque: Prerrequisitos */}
          <div className={`rounded-xl border p-4 transition-colors ${
            validationErrors.prerequisites
              ? 'border-red-400 bg-red-50/20'
              : 'border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02]'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Prerrequisitos <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Conocimientos previos indispensables para el curso.
                </p>
              </div>
              {validationErrors.prerequisites && (
                <span className="text-[11px] text-red-600 dark:text-red-400">{validationErrors.prerequisites}</span>
              )}
            </div>

            <div className="space-y-1.5">
              {(requirementsData.prerequisites || []).map((pre, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-zinc-400 w-4 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={pre}
                    onChange={(e) => onArrayChange('prerequisites', i, e.target.value)}
                    className="flex-1 bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                    placeholder={`Prerrequisito ${i + 1} (Ej: Lógica básica de programación)`}
                  />
                  {requirementsData.prerequisites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveArrayItem('prerequisites', i)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Eliminar prerrequisito"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onAddArrayItem('prerequisites')}
              className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[#00345e] dark:text-blue-400 border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Agregar Prerrequisito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
