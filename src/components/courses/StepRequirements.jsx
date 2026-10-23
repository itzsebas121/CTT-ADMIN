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
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary">Cómo funcionará el curso</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Requisitos y detalles</h2>
        <p className="text-sm text-slate-500 mt-2">Define cuándo ocurre, dónde y qué necesita saber el estudiante.</p>
      </div>

      {/* Fechas */}
      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-slate-900 mb-1">Fechas importantes</h3>
        <p className="text-xs text-slate-500 mb-4">Separa el periodo de inscripción de las fechas de clase.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio Inscripción *</label>
            <input
              required
              type="date"
              value={requirementsData.start_date_registration || ''}
              onChange={(e) => onChange('start_date_registration', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.start_date_registration ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.start_date_registration && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.start_date_registration}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin Inscripción *</label>
            <input
              required
              type="date"
              min={requirementsData.start_date_registration || undefined}
              value={requirementsData.end_date_registration || ''}
              onChange={(e) => onChange('end_date_registration', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.end_date_registration ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.end_date_registration && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.end_date_registration}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio Curso *</label>
            <input
              required
              type="date"
              value={requirementsData.start_date_course || ''}
              onChange={(e) => onChange('start_date_course', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.start_date_course ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.start_date_course && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.start_date_course}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin Curso *</label>
            <input
              required
              type="date"
              min={requirementsData.start_date_course || undefined}
              value={requirementsData.end_date_course || ''}
              onChange={(e) => onChange('end_date_course', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.end_date_course ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.end_date_course && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.end_date_course}</p>
            )}
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-slate-900 mb-1">Horario semanal</h3>
        <p className="text-xs text-slate-500 mb-4">Indica el bloque horario habitual.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Inicio *</label>
            <input
              required
              type="time"
              value={requirementsData.start_time || ''}
              onChange={(e) => onChange('start_time', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.start_time ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.start_time && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.start_time}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Fin *</label>
            <input
              required
              type="time"
              value={requirementsData.end_time || ''}
              onChange={(e) => onChange('end_time', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
                validationErrors.end_time ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {validationErrors.end_time && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.end_time}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación / Lugar de Clases *</label>
        <input
          type="text"
          value={requirementsData.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
            validationErrors.location ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
          }`}
          placeholder="Ej: Sala 301, Edificio A / Laboratorio FISEI"
        />
        {validationErrors.location && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.location}</p>
        )}
      </div>

      {/* Cupos y Horas */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
        <h3 className="font-bold text-slate-900 mb-1">Capacidad y dedicación</h3>
        <p className="text-xs text-slate-500 mb-4">Ayuda a las personas a saber si el curso encaja en su agenda.</p>
        
        {/* CUPOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
              <span>Cupo Mínimo *</span>
              <span className="text-xs text-gray-500 font-normal">(al menos 1)</span>
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
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${
                validationErrors.min_quota ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'
              }`}
            />
            {validationErrors.min_quota && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.min_quota}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
              <span>Cupo Máximo *</span>
              <span className="text-xs text-gray-500 font-normal">(≥ Cupo Mínimo)</span>
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
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${
                validationErrors.max_quota ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'
              }`}
            />
            {validationErrors.max_quota && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.max_quota}</p>
            )}
          </div>
        </div>

        {/* HORAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Horas Presenciales</label>
            <input
              type="number"
              value={requirementsData.in_person_hours === '' ? '' : (requirementsData.in_person_hours ?? 0)}
              min="0"
              onChange={(e) => {
                const val = e.target.value;
                onChange('in_person_hours', val === '' ? 0 : parseInt(val, 10));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Horas Autónomas</label>
            <input
              type="number"
              value={requirementsData.autonomous_hours === '' ? '' : (requirementsData.autonomous_hours ?? 0)}
              min="0"
              onChange={(e) => {
                const val = e.target.value;
                onChange('autonomous_hours', val === '' ? 0 : parseInt(val, 10));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>

      {/* Modalidad y Certificación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad *</label>
          <select
            value={requirementsData.modality || 'Presencial'}
            onChange={(e) => onChange('modality', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Certificación *</label>
          <input
            type="text"
            value={requirementsData.certification || ''}
            onChange={(e) => onChange('certification', e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent ${
              validationErrors.certification ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
            }`}
            placeholder="Ej: Certificado de asistencia y aprobación (40 horas)"
          />
          {validationErrors.certification && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.certification}</p>
          )}
        </div>
      </div>

      {/* Días */}
      <div className={`bg-gray-50 rounded-2xl p-5 border ${validationErrors.days ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-700">Días de clase *</label>
          {validationErrors.days && (
            <span className="text-xs text-red-600 font-medium">{validationErrors.days}</span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
            <label key={day} className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-primary transition">
              <input
                type="checkbox"
                checked={(requirementsData.days || []).includes(day)}
                onChange={(e) => {
                  const currentDays = requirementsData.days || [];
                  if (e.target.checked) {
                    onChange('days', [...currentDays, day]);
                  } else {
                    onChange('days', currentDays.filter(d => d !== day));
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prerrequisitos */}
      <div className={`bg-gray-50 rounded-2xl p-5 border ${validationErrors.prerequisites ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-700">Prerrequisitos *</label>
          {validationErrors.prerequisites && (
            <span className="text-xs text-red-600 font-medium">{validationErrors.prerequisites}</span>
          )}
        </div>
        {(requirementsData.prerequisites || []).map((pre, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
            <input
              type="text"
              value={pre}
              onChange={(e) => onArrayChange('prerequisites', i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
              placeholder={`Prerrequisito ${i + 1} (Ej: Conocimientos básicos de programación)`}
            />
            {requirementsData.prerequisites.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveArrayItem('prerequisites', i)}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem('prerequisites')}
          className="px-4 py-2 bg-white hover:bg-gray-100 text-primary border border-primary/30 rounded-lg transition text-xs font-semibold shadow-xs"
        >
          + Agregar Prerrequisito
        </button>
      </div>

      {/* Precios */}
      <div className={`bg-yellow-50/60 border rounded-2xl p-5 ${validationErrors.prices ? 'border-red-300' : 'border-yellow-200'}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-yellow-900">Estructura de Precios *</label>
          {validationErrors.prices && (
            <span className="text-xs text-red-600 font-medium">{validationErrors.prices}</span>
          )}
        </div>
        {(requirementsData.prices || []).map((price, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
            <div className="w-full md:w-40">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Monto ($)"
                value={price.amount === 0 ? '' : (price.amount ?? '')}
                onChange={(e) => {
                  const val = e.target.value;
                  onPriceChange(i, 'amount', val === '' ? 0 : parseFloat(val));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Categoría (Ej: Estudiantes UTA, Profesionales, Público General)"
              value={price.category || ''}
              onChange={(e) => onPriceChange(i, 'category', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
            />
            {requirementsData.prices.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePrice(i)}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAddPrice}
          className="px-4 py-2 bg-white hover:bg-gray-100 text-yellow-800 border border-yellow-300 rounded-lg transition text-xs font-semibold shadow-xs"
        >
          + Agregar Precio
        </button>
      </div>
    </div>
  )
}
