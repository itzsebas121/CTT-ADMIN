import { useState, useEffect } from "react";
import CategoryCreation from "../ui/CategoryCreation";
import { getAllCategories } from "../../api/categories";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function StepGeneralData({
  courseData,
  onChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  validationErrors = {},
}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const statuses = ["Activo", "Cerrado"];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCategories();
        const CategoriesArray = response.items || response;

        const categoriesData = CategoriesArray.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(categoriesData);

        if (!courseData.category_id && categoriesData.length > 0) {
          onChange("category_id", categoriesData[0].id);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCreateCategory = (categoryData) => {
    const newCategory = {
      id: categoryData.id,
      name: categoryData.name,
    };
    setCategories((prev) => [...prev, newCategory]);
    onChange("category_id", categoryData.id);
  };

  return (
    <div className="space-y-4">
      {/* Grid de 2 Columnas: Izquierda (Datos Básicos) - Derecha (Listas y Objetivos) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* COLUMNA 1: Datos Básicos y Clasificación */}
        <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3.5">
          <div className="pb-2 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Datos Principales
            </h2>
            <span className="text-[11px] text-zinc-400">Paso 1 de 4</span>
          </div>

          {/* Título */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Título del Curso <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">
                {(courseData.title || "").length}/120
              </span>
            </div>
            <input
              type="text"
              value={courseData.title || ""}
              maxLength={120}
              required
              onChange={(e) => onChange("title", e.target.value)}
              className={`w-full rounded-lg border text-xs sm:text-sm px-3 py-2 transition-colors outline-none ${
                validationErrors.title
                  ? "border-red-500 bg-red-50/30 dark:bg-red-950/20 text-zinc-900 dark:text-white"
                  : "border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:border-[#00345e] dark:focus:border-blue-400"
              }`}
              placeholder="Ej: Desarrollo Web Full Stack con React y TypeScript"
            />
            {validationErrors.title && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Descripción <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">
                {(courseData.description || "").length}/1000
              </span>
            </div>
            <textarea
              value={courseData.description || ""}
              maxLength={1000}
              required
              rows={3}
              onChange={(e) => onChange("description", e.target.value)}
              className={`w-full rounded-lg border text-xs sm:text-sm px-3 py-2 transition-colors outline-none resize-y ${
                validationErrors.description
                  ? "border-red-500 bg-red-50/30 dark:bg-red-950/20 text-zinc-900 dark:text-white"
                  : "border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:border-[#00345e] dark:focus:border-blue-400"
              }`}
              placeholder="Describe las habilidades, proyectos y competencias que adquirirá el estudiante..."
            />
            {validationErrors.description && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Categoría y Estado en 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="text-[11px] text-[#00345e] dark:text-blue-400 hover:underline cursor-pointer border-0 bg-transparent p-0"
                  onClick={handleAddCategory}
                >
                  + Nueva
                </button>
              </div>
              <select
                value={courseData.category_id ?? ""}
                onChange={(e) =>
                  onChange(
                    "category_id",
                    e.target.value ? parseInt(e.target.value, 10) : ""
                  )
                }
                disabled={isLoading}
                className={`w-full rounded-lg border text-xs sm:text-sm px-2.5 py-2 transition-colors outline-none ${
                  validationErrors.category_id
                    ? "border-red-500 bg-red-50/30 dark:bg-red-950/20"
                    : "border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:border-[#00345e] dark:focus:border-blue-400"
                }`}
              >
                <option value="" className="dark:bg-[#121215]">
                  -- Seleccionar --
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-[#121215]">
                    {cat.name}
                  </option>
                ))}
              </select>
              {validationErrors.category_id && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                  {validationErrors.category_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={courseData.status || "Activo"}
                onChange={(e) => onChange("status", e.target.value)}
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white text-xs sm:text-sm px-2.5 py-2 transition-colors outline-none focus:border-[#00345e] dark:focus:border-blue-400"
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="dark:bg-[#121215]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lugar / Campus */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Lugar / Campus <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseData.place || ""}
              maxLength={150}
              required
              onChange={(e) => onChange("place", e.target.value)}
              className={`w-full rounded-lg border text-xs sm:text-sm px-3 py-2 transition-colors outline-none ${
                validationErrors.place
                  ? "border-red-500 bg-red-50/30 dark:bg-red-950/20"
                  : "border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:border-[#00345e] dark:focus:border-blue-400"
              }`}
              placeholder="Ej: Campus Huachi, Laboratorio 101"
            />
            {validationErrors.place && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                {validationErrors.place}
              </p>
            )}
          </div>
        </div>

        {/* COLUMNA 2: Participantes, Materiales y Objetivos */}
        <div className="space-y-3">
          {/* Objetivos */}
          <ArrayField
            label="Objetivos de Aprendizaje"
            required
            error={validationErrors.objectives}
            items={courseData.objectives || [""]}
            onItemChange={(i, value) => onArrayChange("objectives", i, value)}
            onAddItem={() => onAddArrayItem("objectives")}
            onRemoveItem={(i) => onRemoveArrayItem("objectives", i)}
            placeholder={(i) => `Objetivo ${i + 1} (Ej: Desarrollar APIs REST seguras)`}
          />

          {/* Docentes / Organizadores */}
          <ArrayField
            label="Docentes / Organizadores"
            required
            error={validationErrors.organizers}
            items={courseData.organizers || [""]}
            onItemChange={(i, value) => onArrayChange("organizers", i, value)}
            onAddItem={() => onAddArrayItem("organizers")}
            onRemoveItem={(i) => onRemoveArrayItem("organizers", i)}
            placeholder={(i) => `Docente ${i + 1} (Ej: Ing. Marco Morales, M.Sc.)`}
          />

          {/* Materiales Requeridos */}
          <ArrayField
            label="Materiales / Requisitos Técnicos"
            required
            error={validationErrors.materials}
            items={courseData.materials || [""]}
            onItemChange={(i, value) => onArrayChange("materials", i, value)}
            onAddItem={() => onAddArrayItem("materials")}
            onRemoveItem={(i) => onRemoveArrayItem("materials", i)}
            placeholder={(i) => `Herramienta ${i + 1} (Ej: Computador con 8GB RAM)`}
          />

          {/* Público Objetivo */}
          <ArrayField
            label="Público Objetivo"
            required
            error={validationErrors.target_audience}
            items={courseData.target_audience || [""]}
            onItemChange={(i, value) => onArrayChange("target_audience", i, value)}
            onAddItem={() => onAddArrayItem("target_audience")}
            onRemoveItem={(i) => onRemoveArrayItem("target_audience", i)}
            placeholder={(i) => `Perfil ${i + 1} (Ej: Estudiantes de TI, Desarrolladores Junior)`}
          />
        </div>
      </div>

      <CategoryCreation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
}

function ArrayField({
  label,
  required,
  error,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  placeholder,
}) {
  return (
    <div
      className={`rounded-xl border p-3 sm:p-3.5 transition-colors ${
        error
          ? "border-red-400 bg-red-50/20"
          : "border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02]"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {error && (
          <span className="text-[11px] text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-zinc-400 w-4 text-right shrink-0">
              {i + 1}.
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => onItemChange(i, e.target.value)}
              className="flex-1 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white px-2.5 py-1.5 text-xs outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
              placeholder={typeof placeholder === "function" ? placeholder(i) : placeholder}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveItem(i)}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer shrink-0"
                title="Eliminar fila"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddItem}
        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[#00345e] dark:text-blue-400 border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-xs font-medium transition cursor-pointer shadow-2xs"
      >
        <PlusIcon className="w-3 h-3" />
        <span>Agregar fila</span>
      </button>
    </div>
  );
}
