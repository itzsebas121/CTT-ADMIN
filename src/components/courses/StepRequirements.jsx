export default function StepRequirements({
  requirementsData,
  onChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onPriceChange,
  onAddPrice,
  onRemovePrice
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Requisitos y Detalles</h2>

      {/* Fechas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📅 Fechas Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio Inscripción *</label>
            <input
              type="date"
              value={requirementsData.start_date_registration}
              onChange={(e) => onChange('start_date_registration', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin Inscripción *</label>
            <input
              type="date"
              value={requirementsData.end_date_registration}
              onChange={(e) => onChange('end_date_registration', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio Curso *</label>
            <input
              type="date"
              value={requirementsData.start_date_course}
              onChange={(e) => onChange('start_date_course', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin Curso *</label>
            <input
              type="date"
              value={requirementsData.end_date_course}
              onChange={(e) => onChange('end_date_course', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">🕐 Horarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Inicio *</label>
            <input
              type="time"
              value={requirementsData.start_time}
              onChange={(e) => onChange('start_time', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Fin *</label>
            <input
              type="time"
              value={requirementsData.end_time}
              onChange={(e) => onChange('end_time', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Ubicación *</label>
        <input
          type="text"
          value={requirementsData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ej: Sala 301, Edificio A"
        />
      </div>

      {/* Cupos y Horas */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-4">👥 Cupos y Horas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cupo Mínimo *</label>
            <input
              type="number"
              value={requirementsData.min_quota}
              onChange={(e) => onChange('min_quota', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cupo Máximo *</label>
            <input
              type="number"
              value={requirementsData.max_quota}
              onChange={(e) => onChange('max_quota', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Horas Presenciales</label>
            <input
              type="number"
              value={requirementsData.in_person_hours}
              onChange={(e) => onChange('in_person_hours', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Horas Autónomas</label>
            <input
              type="number"
              value={requirementsData.autonomous_hours}
              onChange={(e) => onChange('autonomous_hours', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Modalidad y Certificación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad *</label>
          <select
            value={requirementsData.modality}
            onChange={(e) => onChange('modality', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Certificación</label>
          <input
            type="text"
            value={requirementsData.certification}
            onChange={(e) => onChange('certification', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Certificado de participación"
          />
        </div>
      </div>

      {/* Días */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">📆 Días de Clase</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
            <label key={day} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requirementsData.days.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange('days', [...requirementsData.days, day]);
                  } else {
                    onChange('days', requirementsData.days.filter(d => d !== day));
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
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">📋 Prerrequisitos</label>
        {requirementsData.prerequisites.map((pre, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
            <input
              type="text"
              value={pre}
              onChange={(e) => onArrayChange('prerequisites', i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={`Prerrequisito ${i + 1}`}
            />
            <button
              onClick={() => onRemoveArrayItem('prerequisites', i)}
              className="rojo self-end md:self-auto"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          onClick={() => onAddArrayItem('prerequisites')}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition font-medium shadow-sm"
        >
          + Agregar Prerrequisito
        </button>
      </div>

      {/* Precios */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <label className="block text-sm font-semibold text-yellow-900 mb-3">💰 Precios</label>
        {requirementsData.prices.map((price, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
            <input
              type="number"
              placeholder="Monto"
              value={price.amount}
              onChange={(e) => onPriceChange(i, 'amount', parseFloat(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Categoría (Ej: Estudiante, Profesional)"
              value={price.category}
              onChange={(e) => onPriceChange(i, 'category', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={() => onRemovePrice(i)}
              className="rojo self-end md:self-auto"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          onClick={onAddPrice}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition font-medium shadow-sm"
        >
          + Agregar Precio
        </button>
      </div>
    </div>
  )
}
