export default function StepGeneralData({ courseData, onChange, onArrayChange, onAddArrayItem, onRemoveArrayItem }) {
  const categories = ['TICS', 'Educativo', 'Software', 'Electrónica', 'Congresos']
  const statuses = ['Activo', 'Cerrado']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Título del Curso *</label>
          <input
            type="text"
            value={courseData.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent transition"
            placeholder="Ej: Introducción a React"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
          <textarea
            value={courseData.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent transition"
            rows="4"
            placeholder="Describe el curso de manera clara y concisa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
            <select
              value={courseData.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent transition"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              value={courseData.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent transition"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lugar *</label>
            <input
              type="text"
              value={courseData.place}
              onChange={(e) => onChange('place', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent transition"
              placeholder="Ej: Auditorio Principal"
            />
          </div>
        </div>

        {/* Objetivos */}
        <ArrayField
          label="Objetivos del Curso"
          items={courseData.objectives}
          onItemChange={(i, value) => onArrayChange('objectives', i, value)}
          onAddItem={() => onAddArrayItem('objectives')}
          onRemoveItem={(i) => onRemoveArrayItem('objectives', i)}
          placeholder={(i) => `Objetivo ${i + 1}`}
        />

        {/* Organizadores */}
        <ArrayField
          label="Organizadores"
          items={courseData.organizers}
          onItemChange={(i, value) => onArrayChange('organizers', i, value)}
          onAddItem={() => onAddArrayItem('organizers')}
          onRemoveItem={(i) => onRemoveArrayItem('organizers', i)}
          placeholder={(i) => `Organizador ${i + 1}`}
        />

        {/* Materiales */}
        <ArrayField
          label="Materiales Requeridos"
          items={courseData.materials}
          onItemChange={(i, value) => onArrayChange('materials', i, value)}
          onAddItem={() => onAddArrayItem('materials')}
          onRemoveItem={(i) => onRemoveArrayItem('materials', i)}
          placeholder={(i) => `Material ${i + 1}`}
        />

        {/* Público Objetivo */}
        <ArrayField
          label="Público Objetivo"
          items={courseData.target_audience}
          onItemChange={(i, value) => onArrayChange('target_audience', i, value)}
          onAddItem={() => onAddArrayItem('target_audience')}
          onRemoveItem={(i) => onRemoveArrayItem('target_audience', i)}
          placeholder={(i) => `Público ${i + 1}`}
        />
      </div>
    </div>
  )
}

function ArrayField({ label, items, onItemChange, onAddItem, onRemoveItem, placeholder }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
          <input
            type="text"
            value={item}
            onChange={(e) => onItemChange(i, e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent"
            placeholder={typeof placeholder === 'function' ? placeholder(i) : placeholder}
          />
          <button
            onClick={() => onRemoveItem(i)}
            className="rojo self-end md:self-auto"
          > 
            Eliminar
          </button>
        </div>
      ))}
      <button
        onClick={onAddItem}
        className="px-5 py-2.5 bg-[#6C1313] hover:bg-[#5a0f0f] text-white rounded-lg transition font-medium shadow-sm"
      >
        + Agregar
      </button>
    </div>
  )
}
