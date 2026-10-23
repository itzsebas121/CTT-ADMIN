import { useState, useEffect } from "react"
import CategoryCreation from "../ui/CategoryCreation"
import { getAllCategories } from "../../api/categories"

export default function StepGeneralData({
  courseData,
  onChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  validationErrors = {}
}) {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const statuses = ['Activo', 'Cerrado']
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCategories();
        const CategoriesArray = response.items || response;

        const categoriesData = CategoriesArray.map(cat => ({
          id: cat.id,
          name: cat.name,
        }))
        setCategories(categoriesData);

        // Si no hay categoría seleccionada, seleccionar la primera por defecto
        if (!courseData.category_id && categoriesData.length > 0) {
          onChange('category_id', categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, [])

  const handleAddCategory = () => {
    setIsModalOpen(true)
  }

  const handleCreateCategory = (categoryData) => {
    const newCategory = {
      id: categoryData.id,
      name: categoryData.name,
    }
    setCategories(prev => [...prev, newCategory])
    onChange('category_id', categoryData.id)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary">El punto de partida</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Cuéntanos sobre el curso</h2>
        <p className="text-sm text-slate-500 mt-2">Esta información aparecerá en el catálogo y ayudará a elegirlo.</p>
      </div>

      <div className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
            <span>Título del Curso <span className="text-red-500">*</span></span>
            <span className="text-xs text-gray-400 font-normal">({(courseData.title || '').length}/120)</span>
          </label>
          <input
            type="text"
            value={courseData.title || ''}
            maxLength={120}
            required
            onChange={(e) => onChange('title', e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition ${
              validationErrors.title ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
            }`}
            placeholder="Ej: Introducción a React y TypeScript"
          />
          {validationErrors.title && (
            <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.title}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
            <span>Descripción <span className="text-red-500">*</span></span>
            <span className="text-xs text-gray-400 font-normal">({(courseData.description || '').length}/1000)</span>
          </label>
          <textarea
            value={courseData.description || ''}
            maxLength={1000}
            required
            onChange={(e) => onChange('description', e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition resize-y ${
              validationErrors.description ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
            }`}
            rows="4"
            placeholder="Describe los temas, objetivos y habilidades que adquirirá el estudiante..."
          />
          {validationErrors.description && (
            <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={courseData.category_id ?? ''}
              onChange={(e) => onChange('category_id', e.target.value ? parseInt(e.target.value, 10) : '')}
              disabled={isLoading}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white ${
                validationErrors.category_id ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {validationErrors.category_id && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.category_id}</p>
            )}
            <button
              type="button"
              className="mt-2 text-xs text-primary hover:underline font-semibold cursor-pointer"
              onClick={handleAddCategory}
            >
              + Registrar Nueva Categoría
            </button>
          </div>

          {/* Estado del Curso */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado del Curso *</label>
            <select
              value={courseData.status || 'Activo'}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Lugar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lugar / Campus <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseData.place || ''}
              maxLength={150}
              required
              onChange={(e) => onChange('place', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition ${
                validationErrors.place ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
              placeholder="Ej: Campus Huachi, Laboratorio 101"
            />
            {validationErrors.place && (
              <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.place}</p>
            )}
          </div>
        </div>

        {/* Objetivos */}
        <ArrayField
          label="Objetivos del Curso *"
          error={validationErrors.objectives}
          items={courseData.objectives || ['']}
          onItemChange={(i, value) => onArrayChange('objectives', i, value)}
          onAddItem={() => onAddArrayItem('objectives')}
          onRemoveItem={(i) => onRemoveArrayItem('objectives', i)}
          placeholder={(i) => `Objetivo ${i + 1} (Ej: Aprender fundamentos de programación)`}
        />

        {/* Organizadores */}
        <ArrayField
          label="Organizadores / Docentes *"
          error={validationErrors.organizers}
          items={courseData.organizers || ['']}
          onItemChange={(i, value) => onArrayChange('organizers', i, value)}
          onAddItem={() => onAddArrayItem('organizers')}
          onRemoveItem={(i) => onRemoveArrayItem('organizers', i)}
          placeholder={(i) => `Organizador ${i + 1} (Ej: Ing. Juan Pérez)`}
        />

        {/* Materiales */}
        <ArrayField
          label="Materiales Requeridos *"
          error={validationErrors.materials}
          items={courseData.materials || ['']}
          onItemChange={(i, value) => onArrayChange('materials', i, value)}
          onAddItem={() => onAddArrayItem('materials')}
          onRemoveItem={(i) => onRemoveArrayItem('materials', i)}
          placeholder={(i) => `Material ${i + 1} (Ej: Laptop personal)`}
        />

        {/* Público Objetivo */}
        <ArrayField
          label="Público Objetivo *"
          error={validationErrors.target_audience}
          items={courseData.target_audience || ['']}
          onItemChange={(i, value) => onArrayChange('target_audience', i, value)}
          onAddItem={() => onAddArrayItem('target_audience')}
          onRemoveItem={(i) => onRemoveArrayItem('target_audience', i)}
          placeholder={(i) => `Público ${i + 1} (Ej: Estudiantes de sistemas)`}
        />
      </div>

      {/* Modal para crear categoría */}
      <CategoryCreation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  )
}

function ArrayField({ label, items, onItemChange, onAddItem, onRemoveItem, placeholder, error }) {
  return (
    <div className={`bg-gray-50 rounded-2xl p-5 border ${error ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-2 mb-3">
          <input
            type="text"
            value={item}
            onChange={(e) => onItemChange(i, e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
            placeholder={typeof placeholder === 'function' ? placeholder(i) : placeholder}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(i)}
              className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="px-4 py-2 bg-white hover:bg-gray-100 text-primary border border-primary/30 rounded-lg transition text-xs font-semibold shadow-xs cursor-pointer"
      >
        + Agregar elemento
      </button>
    </div>
  )
}
