import { useState } from 'react';
import { createSpeaker, uploadSpeakerPhoto } from '../../api/congresses';
import { toast } from 'react-toastify';
import { XMarkIcon, UserIcon, ArrowUpTrayIcon, LinkIcon } from '@heroicons/react/24/outline';

const SPEAKER_TYPES = [
  { value: 'magistral', label: 'Conferencista Magistral (Keynote)' },
  { value: 'ponente', label: 'Ponente de Artículo / Paper' },
  { value: 'tallerista', label: 'Instructor de Taller / Workshop' },
  { value: 'panelista', label: 'Panelista / Moderador' },
];

export default function CreateSpeakerModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    nombres_completos: '',
    titulo_academico: '',
    institucion: '',
    pais: '',
    tipo_speaker: 'magistral',
    foto_url: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'foto_url' && useUrlMode) {
      setPhotoPreview(value);
    }
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleClearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData((prev) => ({ ...prev, foto_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombres_completos.trim()) {
      setError('Los nombres completos son obligatorios.');
      return;
    }
    if (formData.nombres_completos.trim().split(' ').length < 2) {
      setError('Por favor ingresa nombre y apellido.');
      return;
    }
    if (!formData.titulo_academico.trim()) {
      setError('El título o grado académico es obligatorio (ej. Ph.D., M.Sc., Ing.).');
      return;
    }
    if (!formData.institucion.trim()) {
      setError('La institución o universidad de filiación es obligatoria.');
      return;
    }
    if (!formData.pais.trim()) {
      setError('El país del ponente es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalFotoUrl = formData.foto_url.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

      if (photoFile && !useUrlMode) {
        const uploadRes = await uploadSpeakerPhoto(photoFile);
        finalFotoUrl = uploadRes.image_url || uploadRes.url || finalFotoUrl;
      }

      const payload = {
        nombres_completos: formData.nombres_completos.trim(),
        titulo_academico: formData.titulo_academico.trim(),
        institucion: formData.institucion.trim(),
        pais: formData.pais.trim(),
        tipo_speaker: formData.tipo_speaker,
        foto_url: finalFotoUrl,
      };

      const res = await createSpeaker(payload);

      const newId = res.speaker_id || res.data?.id_speaker || res.data?.id;
      const createdSpeaker = {
        id_speaker: newId,
        id: newId,
        nombres_completos: res.data?.nombres_completos || payload.nombres_completos,
        titulo_academico: res.data?.titulo_academico || payload.titulo_academico,
        institucion: res.data?.institucion || payload.institucion,
        pais: res.data?.pais || payload.pais,
        tipo_speaker: res.data?.tipo_speaker || payload.tipo_speaker,
        foto_url: res.data?.foto_url || finalFotoUrl,
      };

      toast.success('¡Ponente registrado exitosamente en el catálogo!');
      if (onCreated) {
        onCreated(createdSpeaker);
      }

      // Reset
      setFormData({
        nombres_completos: '',
        titulo_academico: '',
        institucion: '',
        pais: '',
        tipo_speaker: 'magistral',
        foto_url: '',
      });
      setPhotoFile(null);
      setPhotoPreview('');
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar el ponente');
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
        className="bg-white dark:bg-[#16161a] rounded-xl w-full max-w-lg p-5 shadow-2xl border border-black/[0.08] dark:border-white/[0.08] transition-colors max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Registrar Nuevo Ponente
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Agrega un conferencista internacional o nacional al catálogo académico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Nombres y Grado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nombres Completos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombres_completos"
                value={formData.nombres_completos}
                onChange={handleChange}
                placeholder="Ej. Dr. Luis Joyanes Aguilar"
                className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Título Académico <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo_academico"
                value={formData.titulo_academico}
                onChange={handleChange}
                placeholder="Ej. Ph.D. en Ciencias de la Computación"
                className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Institución y País */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Institución / Universidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institucion"
                value={formData.institucion}
                onChange={handleChange}
                placeholder="Ej. Universidad Politécnica de Madrid"
                className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                País de Residencia / Filiación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                placeholder="Ej. España, Ecuador, Colombia"
                className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Tipo de Speaker */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Rol / Tipo de Ponente
            </label>
            <select
              name="tipo_speaker"
              value={formData.tipo_speaker}
              onChange={handleChange}
              className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition cursor-pointer"
            >
              {SPEAKER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fotografía con previsualización */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Fotografía del Ponente
              </label>
              <button
                type="button"
                onClick={() => setUseUrlMode(!useUrlMode)}
                className="text-[11px] text-[#00345e] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {useUrlMode ? (
                  <>
                    <ArrowUpTrayIcon className="w-3 h-3" />
                    <span>Subir archivo</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-3 h-3" />
                    <span>Ingresar enlace URL</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02]">
              {/* Avatar Preview */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 border border-black/10 dark:border-white/10 flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPhotoPreview('')}
                  />
                ) : (
                  <UserIcon className="w-7 h-7 text-zinc-400" />
                )}
              </div>

              {/* Input field */}
              <div className="flex-1 min-w-0">
                {useUrlMode ? (
                  <input
                    type="url"
                    name="foto_url"
                    value={formData.foto_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/foto-ponente.jpg"
                    className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition"
                  />
                ) : (
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="w-full text-xs text-zinc-600 dark:text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00345e]/10 file:text-[#00345e] dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-[#00345e]/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-zinc-400">PNG, JPG o WEBP (máx. 5MB)</p>
                  </div>
                )}

                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="text-[10px] text-red-500 hover:underline mt-1 cursor-pointer block"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#00345e] hover:bg-[#002847] active:bg-[#001f38] text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                'Guardar Ponente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

