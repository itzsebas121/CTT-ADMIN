import { useState } from 'react';
import { createSponsor, uploadCongressPoster } from '../../api/congresses';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
        className="bg-white dark:bg-[#16161a] rounded-xl w-full max-w-lg p-5 shadow-2xl border border-black/[0.08] dark:border-white/[0.08] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 mb-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Registrar Nuevo Patrocinador
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Añade una empresa u organización al catálogo para auspiciar congresos
            </p>
          </div>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md transition-colors cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3.5 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nombre de la Empresa / Entidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              maxLength={100}
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Google Cloud, Banco Pichincha, IEEE Ecuador"
              className="w-full h-9 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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
              className="w-full h-9 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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
              className="w-full p-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Logo de la Empresa (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="block w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#00345e]/10 dark:file:bg-blue-400/10 file:text-[#00345e] dark:file:text-blue-300 hover:file:bg-[#00345e]/20 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 border border-black/[0.08] dark:border-white/[0.08] rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 bg-[#00345e] hover:bg-[#002747] text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-2xs border-0"
            >
              {loading ? 'Guardando...' : 'Guardar y Vincular'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
