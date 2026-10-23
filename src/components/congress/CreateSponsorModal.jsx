import { useState } from 'react';
import { createSponsor, uploadCongressPoster } from '../../api/congresses';
import { toast } from 'react-toastify';

export default function CreateSponsorModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    sitio_web: '',
    descripcion: '',
    logo_url: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del patrocinador es obligatorio.');
      return;
    }
    if (!formData.sitio_web.trim()) {
      setError('El sitio web es obligatorio (ej: https://empresa.com).');
      return;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción del patrocinador es obligatoria.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalLogoUrl = formData.logo_url?.trim() || 'https://via.placeholder.com/150';

      if (logoFile) {
        const uploadRes = await uploadCongressPoster(logoFile);
        finalLogoUrl = uploadRes.image_url || uploadRes.url || finalLogoUrl;
      }

      const res = await createSponsor({
        nombre: formData.nombre.trim(),
        sitio_web: formData.sitio_web.trim(),
        descripcion: formData.descripcion.trim(),
        logo_url: finalLogoUrl,
      });

      const newId = res.sponsor_id || res.data?.id_sponsor || res.data?.id;
      const newSponsor = {
        id_sponsor: newId,
        id: newId,
        nombre: res.data?.nombre || formData.nombre.trim(),
        sitio_web: res.data?.sitio_web || formData.sitio_web.trim(),
        descripcion: res.data?.descripcion || formData.descripcion.trim(),
        logo_url: res.data?.logo_url || finalLogoUrl,
      };

      toast.success('¡Patrocinador registrado exitosamente!');
      if (onCreated) {
        onCreated(newSponsor);
      }
      // Reset form
      setFormData({
        nombre: '',
        sitio_web: '',
        descripcion: '',
        logo_url: '',
      });
      setLogoFile(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar patrocinador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registrar Nuevo Patrocinador</h3>
            <p className="text-xs text-gray-500">
              Registra una nueva empresa en el catálogo para asociarla a congresos
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nombre de la Empresa / Organización <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              maxLength={100}
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Banco Pichincha, Google, Microsoft"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sitio Web Oficial <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="sitio_web"
              required
              maxLength={200}
              value={formData.sitio_web}
              onChange={handleChange}
              placeholder="https://empresa.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Descripción de la Empresa <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              required
              maxLength={500}
              rows={2}
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Breve reseña o actividad de la entidad auspiciante..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Logo de la Empresa (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar y Vincular'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

