import { useEffect, useState } from 'react';
import { updateCategory, uploadCategorySVG, createCategory } from '../../api/categories';

const CategoryEdition = ({ isOpen, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    svgurl: "",
    status: "activo",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filesvg, setFilesvg] = useState(null);
  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        svgurl: category.svgurl || "",
        status: category.status || "activo",
      });
    } else {
      // Reset form for creation
      setFormData({
        name: "",
        description: "",
        svgurl: "",
        status: "activo",
      });
      setFilesvg(null);
    }
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let formDataToSubmit = { ...formData };
      if (filesvg) {
        const responsesvg = await uploadCategorySVG(filesvg);
        formDataToSubmit = {
          ...formDataToSubmit,
          svgurl: responsesvg.svg_url,
        };
      }

      let result;
      if (isEditing) {
        result = await updateCategory(category.id, formDataToSubmit);
      } else {
        result = await createCategory(formDataToSubmit);
      }

      onSubmit(result);
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Error completo:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      setError(JSON.stringify(err.response?.data) || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      svgurl: "",
      status: "activo",
    });
    setFilesvg(null);
    setError(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      setFormData((prev) => ({
        ...prev,
        svgfile: file,
      }));
      setFilesvg(file);
    } else if (file) {
      setError("Por favor, selecciona un archivo SVG válido.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Editar Categoría" : "Crear Categoría"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre de la categoría"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="svgurl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Archivo SVG {formData.svgurl && isEditing && "(Opcional - Dejar vacío para mantener el actual)"}
            </label>
            {formData.svgurl && !filesvg && isEditing && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                SVG actual: {formData.svgurl.split('/').pop()}
              </div>
            )}
            <input
              type="file"
              id="svgfile"
              name="svgfile"
              onChange={handleFileChange}
              className="hidden w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => document.getElementById("svgfile").click()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
            >
              <span className="text-shadow-gray-50">
                {formData.svgfile
                  ? formData.svgfile.name
                  : (isEditing ? "Seleccionar Nuevo Archivo (Opcional)" : "Seleccionar Archivo SVG")}
              </span>
              <svg
                className="w-5 h-5 text-shadow-gray-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {isLoading ? (isEditing ? "Actualizando..." : "Creando...") : (isEditing ? "Actualizar Categoría" : "Crear Categoría")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdition;