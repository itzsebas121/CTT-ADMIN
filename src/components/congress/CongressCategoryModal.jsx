import { useEffect, useState } from 'react';
import {
  createCongressCategory,
  updateCongressCategory,
  uploadCongressCategorySVG,
} from '../../api/congressCategories';

export default function CongressCategoryModal({ isOpen, onClose, onSubmit, category = null }) {
  const isEditing = Boolean(category);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    svgurl: '',
    status: 'activo',
  });
  const [fileSvg, setFileSvg] = useState(null);
  const [svgPreview, setSvgPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        svgurl: category.svgurl || '',
        status: category.status || 'activo',
      });
      setSvgPreview(category.svgurl || '');
    } else {
      setFormData({
        name: '',
        description: '',
        svgurl: '',
        status: 'activo',
      });
      setSvgPreview('');
    }
    setFileSvg(null);
    setError(null);
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        setFileSvg(file);
        setError(null);
        // Generar preview local
        const reader = new FileReader();
        reader.onload = (event) => {
          setSvgPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Por favor selecciona un archivo SVG válido (.svg).');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let finalSvgUrl = formData.svgurl;

      if (fileSvg) {
        const uploadRes = await uploadCongressCategorySVG(fileSvg);
        finalSvgUrl = uploadRes.svg_url || uploadRes.url || finalSvgUrl;
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        svgurl: finalSvgUrl || null,
        status: formData.status || 'activo',
      };

      let result;
      if (isEditing) {
        result = await updateCongressCategory(category.id, payload);
      } else {
        result = await createCongressCategory(payload);
      }

      if (onSubmit) {
        onSubmit(result);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Categoría de Congreso' : 'Nueva Categoría de Congreso'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {isEditing
                ? 'Actualiza los datos de la categoría seleccionada'
                : 'Registra una nueva categoría para clasificar congresos'}
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 transition-colors text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
            <span className="font-semibold text-base leading-none">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
              <span>Nombre de la categoría <span className="text-red-500">*</span></span>
              <span className="text-xs text-gray-400 font-normal">({formData.name.length}/100)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Inteligencia Artificial y Robótica"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
              <span>Descripción</span>
              <span className="text-xs text-gray-400 font-normal">({formData.description.length}/500)</span>
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={500}
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el ámbito temático o alcance de esta categoría..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-none"
            />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-white"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Ícono SVG */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ícono SVG (opcional)
            </label>
            <div className="flex items-center gap-4">
              {svgPreview ? (
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <img
                    src={svgPreview}
                    alt="SVG Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center shrink-0 p-1">
                  Sin ícono
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="svgfile"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Formato SVG recomendado, máx. 2MB</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Crear Categoría'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

