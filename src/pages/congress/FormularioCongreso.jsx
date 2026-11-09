import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  BookOpenIcon,
  PhotoIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import {
  StepGeneralData,
  StepDescriptionPoster,
  StepSessions,
  StepSponsors,
  CreateSponsorModal,
  CreateSpeakerModal,
} from "../../components/congress";
import {
  getCongressById,
  createCongress,
  updateCongress,
  uploadCongressPoster,
  checkCongressEdition,
  getSponsorsList,
  getSpeakersList,
} from "../../api/congresses";
import api from "../../api/api";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { toast } from "react-toastify";

export default function FormularioCongreso() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "crear");
  const navigate = useNavigate();
  const { isDark } = useDashboardTheme();

  const [step, setStep] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Modales para registrar entidades al vuelo
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [activeSessionIndexForSpeaker, setActiveSessionIndexForSpeaker] = useState(null);

  // Datos principales del congreso
  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    anio: new Date().getFullYear(),
    fecha_inicio: "",
    fecha_fin: "",
    descripcion_general: "",
    poster_cover_url: "",
    lugar_sede: "Campus Huachi - Auditorio Central de la FISEI, Ambato",
    modalidad: "Presencial",
    duracion_horas: 40,
    sitio_web_oficial: "",
    cupo_maximo: 250,
    costo_estudiante_uta: 0,
    costo_profesional: 0,
    costo_ponente: 0,
  });

  // Ejes temáticos y público objetivo dinámicos (enriquecen la experiencia)
  const [thematicTracks, setThematicTracks] = useState([
    "Inteligencia Artificial y Modelos Multimodales",
    "Ciberseguridad y Redes Avanzadas",
    "Ingeniería de Software y Arquitecturas Cloud",
  ]);

  const [targetAudiences, setTargetAudiences] = useState([
    "Docentes, investigadores y profesionales del sector tecnológico",
    "Estudiantes de pregrado y posgrado en carreras afines a la computación",
  ]);

  // Estado para el afiche oficial
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Verificación de disponibilidad de edición y año en tiempo real
  const [editionCheck, setEditionCheck] = useState({
    checking: false,
    available: null,
    message: "",
  });

  // Sesiones de cronograma
  const [sessions, setSessions] = useState([]);
  // Patrocinadores asociados
  const [sponsors, setSponsors] = useState([]);

  // Catálogos reales del backend
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [availableSponsors, setAvailableSponsors] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const steps = [
    { name: "Datos Generales", description: "Identificación, fechas y sede" },
    { name: "Descripción y Portada", description: "Resumen y afiche oficial" },
    { name: "Cronograma", description: "Sesiones y conferencias" },
    { name: "Patrocinadores", description: "Empresas y auspicios" },
  ];

  const stepMeta = [
    { step: 1, label: "Información", sub: "Datos y fechas", icon: BookOpenIcon },
    { step: 2, label: "Descripción", sub: "Alcance y afiche", icon: PhotoIcon },
    { step: 3, label: "Cronograma", sub: "Sesiones y ponentes", icon: CalendarDaysIcon },
    { step: 4, label: "Patrocinadores", sub: "Empresas y auspicios", icon: BuildingOffice2Icon },
  ];

  // 1. Cargar datos en modo edición
  useEffect(() => {
    if (isEdit) {
      const loadCongress = async () => {
        try {
          setLoadingInitial(true);
          const data = await getCongressById(id);
          const c = data.congress || data;
          setFormData({
            nombre: c.nombre || "",
            edicion: c.edicion || "",
            anio: c.anio || new Date().getFullYear(),
            fecha_inicio: c.fecha_inicio || "",
            fecha_fin: c.fecha_fin || "",
            descripcion_general: c.descripcion_general || "",
            poster_cover_url: c.poster_cover_url || "",
            lugar_sede: c.lugar_sede || "Campus Huachi - Auditorio Central de la FISEI, Ambato",
            modalidad: c.modalidad || "Presencial",
            duracion_horas: c.duracion_horas || 40,
            sitio_web_oficial: c.sitio_web_oficial || "",
            cupo_maximo: c.cupo_maximo || 250,
            costo_estudiante_uta: c.costo_estudiante_uta || 0,
            costo_profesional: c.costo_profesional || 0,
            costo_ponente: c.costo_ponente || 0,
          });
          if (c.poster_cover_url) {
            setPosterPreview(c.poster_cover_url);
          }
          const loadedSessions = data.sesiones || data.sessions || [];
          if (Array.isArray(loadedSessions) && loadedSessions.length > 0) {
            setSessions(
              loadedSessions.map((s) => ({
                id_sesion: s.id_sesion,
                fecha: s.fecha || c.fecha_inicio || "",
                hora_inicio: s.hora_inicio ? s.hora_inicio.slice(0, 5) : "09:00",
                hora_fin: s.hora_fin ? s.hora_fin.slice(0, 5) : "10:30",
                titulo_sesion: s.titulo_sesion || "",
                jornada: s.jornada || "mañana",
                lugar: s.lugar || c.lugar_sede || "Auditorio FISEI",
                id_speaker: s.id_speaker || s.speaker?.id_speaker || "",
              }))
            );
          }
          const loadedSponsors = data.sponsors || [];
          if (Array.isArray(loadedSponsors) && loadedSponsors.length > 0) {
            setSponsors(
              loadedSponsors.map((sp) => ({
                id_sponsor: sp.id_sponsor || sp.id,
                categoria: sp.categoria || "oro",
                aporte: sp.aporte || 0,
                nombre: sp.sponsor_name || sp.nombre || "",
                logo_url: sp.logo_url || "",
              }))
            );
          }
        } catch (err) {
          setSubmitError(`Error al cargar el congreso: ${err.message}`);
          toast.error("No se pudo cargar la información del congreso.");
        } finally {
          setLoadingInitial(false);
        }
      };
      loadCongress();
    }
  }, [id, isEdit]);

  // 2. Cargar catálogos completos de ponentes y patrocinadores
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [spkList, spoList] = await Promise.allSettled([
          getSpeakersList(1, 100),
          getSponsorsList(1, 100),
        ]);

        if (spkList.status === "fulfilled") {
          const list = spkList.value;
          setAvailableSpeakers(Array.isArray(list) ? list : []);
        }
        if (spoList.status === "fulfilled") {
          setAvailableSponsors(Array.isArray(spoList.value) ? spoList.value : []);
        }
      } catch (err) {
        console.warn("Error cargando catálogos de ponentes y auspiciantes:", err);
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  // 3. Verificar disponibilidad de edición y año en tiempo real
  useEffect(() => {
    if (!formData.edicion || !formData.anio) {
      setEditionCheck({ checking: false, available: null, message: "" });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setEditionCheck((prev) => ({ ...prev, checking: true }));
        const check = await checkCongressEdition(
          formData.edicion.trim(),
          formData.anio,
          isEdit ? id : null
        );
        setEditionCheck({
          checking: false,
          available: check.available,
          message: check.available
            ? "Edición y año disponibles"
            : "Ya existe un congreso con esta edición y año",
        });
      } catch {
        setEditionCheck({ checking: false, available: true, message: "" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.edicion, formData.anio, isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "anio"
          ? value === ""
            ? ""
            : Number.isNaN(Number.parseInt(value, 10))
            ? ""
            : Number.parseInt(value, 10)
          : value,
    }));
    // Limpiar error de campo al editar
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).");
        return;
      }
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPosterPreview(event.target.result);
      };
      reader.readAsDataURL(file);

      if (validationErrors.poster_cover_url) {
        setValidationErrors((prev) => {
          const copy = { ...prev };
          delete copy.poster_cover_url;
          return copy;
        });
      }
    }
  };

  // Manejo de Ejes Temáticos dinámicos
  const handleAddTrack = () => {
    setThematicTracks((prev) => [...prev, ""]);
  };

  const handleRemoveTrack = (index) => {
    setThematicTracks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeTrack = (index, value) => {
    setThematicTracks((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Manejo de Público Objetivo dinámico
  const handleAddAudience = () => {
    setTargetAudiences((prev) => [...prev, ""]);
  };

  const handleRemoveAudience = (index) => {
    setTargetAudiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeAudience = (index, value) => {
    setTargetAudiences((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Manejo de Sesiones
  const handleAddSession = () => {
    const defaultSpeakerId =
      availableSpeakers.length > 0
        ? availableSpeakers[0].id_speaker || availableSpeakers[0].id
        : "";

    setSessions((prev) => [
      ...prev,
      {
        titulo_sesion: "",
        lugar: formData.lugar_sede || "Auditorio Principal FISEI",
        fecha: formData.fecha_inicio || "",
        hora_inicio: "09:00",
        hora_fin: "10:30",
        jornada: "mañana",
        id_speaker: defaultSpeakerId,
      },
    ]);
  };

  const handleSessionChange = (index, field, value) => {
    setSessions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveSession = (index) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejo de Patrocinadores
  const handleAddSponsor = () => {
    if (availableSponsors.length === 0) {
      setIsSponsorModalOpen(true);
      return;
    }

    // Buscar una empresa no asignada aún
    const unassigned = availableSponsors.find(
      (spo) =>
        !sponsors.some(
          (s) => Number(s.id_sponsor) === Number(spo.id_sponsor || spo.id)
        )
    );

    if (!unassigned) {
      toast.info(
        "Todas las empresas del catálogo ya están asociadas. Puedes registrar una nueva empresa para agregar otro patrocinador."
      );
      setIsSponsorModalOpen(true);
      return;
    }

    setSponsors((prev) => [
      ...prev,
      {
        id_sponsor: unassigned.id_sponsor || unassigned.id,
        categoria: "oro",
        aporte: 1000,
      },
    ]);
  };

  const handleSponsorChange = (index, field, value) => {
    setSponsors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveSponsor = (index) => {
    setSponsors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSponsorCreated = (newSponsor) => {
    const newId = newSponsor.id_sponsor || newSponsor.id;
    setAvailableSponsors((prev) => [newSponsor, ...prev]);
    setSponsors((prev) => [
      ...prev,
      {
        id_sponsor: newId,
        categoria: "oro",
        aporte: 1000,
      },
    ]);
  };

  const handleOpenSpeakerModal = (sessionIndex) => {
    setActiveSessionIndexForSpeaker(sessionIndex);
    setIsSpeakerModalOpen(true);
  };

  const handleSpeakerCreated = (newSpeaker) => {
    const newId = newSpeaker.id_speaker || newSpeaker.id;
    setAvailableSpeakers((prev) => [newSpeaker, ...prev]);
    if (activeSessionIndexForSpeaker !== null && activeSessionIndexForSpeaker >= 0) {
      handleSessionChange(activeSessionIndexForSpeaker, "id_speaker", newId);
    }
  };

  // Validaciones rigurosas por paso (Pydantic / Postgres / Controller)
  const validateStep = (s) => {
    const errors = {};

    if (s === 1) {
      const name = formData.nombre?.trim();
      if (!name || name.length < 3) {
        errors.nombre = "El nombre del congreso debe tener al menos 3 caracteres.";
      } else if (name.length > 100) {
        errors.nombre = "El nombre del congreso no puede superar los 100 caracteres.";
      }

      const ed = formData.edicion?.trim();
      if (!ed) {
        errors.edicion = "La edición del congreso es obligatoria.";
      } else if (ed.length > 10) {
        errors.edicion = "La edición no puede superar los 10 caracteres.";
      }

      const year = parseInt(formData.anio, 10);
      if (isNaN(year) || year < 2000 || year > 2100) {
        errors.anio = "El año debe estar comprendido entre 2000 y 2100.";
      }

      if (!formData.fecha_inicio) {
        errors.fecha_inicio = "La fecha de inicio es requerida.";
      }
      if (!formData.fecha_fin) {
        errors.fecha_fin = "La fecha de finalización es requerida.";
      }
      if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_fin < formData.fecha_inicio) {
        errors.fecha_fin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
      }

      if (editionCheck.available === false) {
        errors.edicion = "Ya existe un congreso registrado con esta edición y año.";
      }
    }

    if (s === 2) {
      const desc = formData.descripcion_general?.trim();
      if (!desc || desc.length < 5) {
        errors.descripcion_general = "La descripción general es obligatoria (mínimo 5 caracteres).";
      }

      if (!posterFile && !formData.poster_cover_url?.trim()) {
        errors.poster_cover_url = "Debes subir un afiche de portada o ingresar una URL válida.";
      } else if (!posterFile && formData.poster_cover_url?.trim()) {
        try {
          const url = new URL(formData.poster_cover_url.trim());
          if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
            throw new Error();
          }
        } catch {
          errors.poster_cover_url = "Ingresa una URL válida (http:// o https://).";
        }
      }
    }

    if (s === 3) {
      if (sessions.length > 0) {
        sessions.forEach((sess, idx) => {
          if (!sess.id_speaker) {
            errors[`session_${idx}`] = `Sesión #${idx + 1}: Selecciona un ponente asignado.`;
          }
          if (!sess.titulo_sesion || sess.titulo_sesion.trim().length < 5) {
            errors[`session_${idx}`] = `Sesión #${idx + 1}: El título debe tener al menos 5 caracteres.`;
          }
          if (!sess.lugar || sess.lugar.trim().length < 3) {
            errors[`session_${idx}`] = `Sesión #${idx + 1}: Especifica un lugar válido (mínimo 3 caracteres).`;
          }
          if (
            sess.fecha &&
            formData.fecha_inicio &&
            formData.fecha_fin &&
            (sess.fecha < formData.fecha_inicio || sess.fecha > formData.fecha_fin)
          ) {
            errors[`session_${idx}`] = `Sesión #${idx + 1}: La fecha debe estar dentro del congreso (${formData.fecha_inicio} al ${formData.fecha_fin}).`;
          }
          if (sess.hora_inicio && sess.hora_fin && sess.hora_fin <= sess.hora_inicio) {
            errors[`session_${idx}`] = `Sesión #${idx + 1}: La hora de fin debe ser posterior a la de inicio.`;
          }
        });
      }
    }

    if (s === 4) {
      if (sponsors.length > 0) {
        const sponsorIds = sponsors.map((sp) => Number(sp.id_sponsor));
        if (new Set(sponsorIds).size !== sponsorIds.length) {
          errors.sponsors = "No puedes vincular la misma empresa patrocinadora más de una vez.";
        }
        const emptySponsor = sponsors.find((sp) => !sp.id_sponsor);
        if (emptySponsor) {
          errors.sponsors = "Selecciona una empresa para cada patrocinador agregado o elimina la fila.";
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(Math.min(4, step + 1));
    } else {
      toast.warning(`Por favor completa los campos requeridos en el Paso ${step} antes de continuar.`);
    }
  };

  const handleStepClick = (number) => {
    if (number <= step) {
      setStep(number);
    } else {
      for (let s = step; s < number; s++) {
        if (!validateStep(s)) {
          toast.warning(`Completa los campos requeridos en el Paso ${s} antes de avanzar.`);
          return;
        }
      }
      setStep(number);
    }
  };

  // Envío del Formulario
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      toast.warning("Por favor revisa los campos señalados antes de publicar.");
      return;
    }

    if (editionCheck.checking) {
      toast.info("Verificando disponibilidad de edición y año...");
      return;
    }
    if (editionCheck.available === false) {
      toast.error("Ya existe un congreso con esta edición y año.");
      setStep(1);
      return;
    }

    setSaving(true);
    setSubmitError(null);

    try {
      let finalPosterUrl = formData.poster_cover_url?.trim() || "";

      if (posterFile) {
        setUploadingPoster(true);
        const uploadRes = await uploadCongressPoster(posterFile);
        finalPosterUrl = uploadRes.image_url || uploadRes.url || finalPosterUrl;
        setUploadingPoster(false);
      }

      if (!finalPosterUrl) {
        toast.warning("El afiche de portada es obligatorio.");
        setSaving(false);
        setStep(2);
        return;
      }

      const congressPayload = {
        nombre: formData.nombre.trim(),
        edicion: formData.edicion.trim(),
        anio: parseInt(formData.anio, 10),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        descripcion_general: formData.descripcion_general.trim(),
        poster_cover_url: finalPosterUrl,
        lugar_sede: formData.lugar_sede?.trim() || "Campus Huachi - Auditorio Central de la FISEI, Ambato",
        modalidad: formData.modalidad || "Presencial",
        duracion_horas: parseInt(formData.duracion_horas, 10) || 40,
        sitio_web_oficial: formData.sitio_web_oficial?.trim() || "",
        cupo_maximo: parseInt(formData.cupo_maximo, 10) || 250,
        costo_estudiante_uta: parseFloat(formData.costo_estudiante_uta) || 0.0,
        costo_profesional: parseFloat(formData.costo_profesional) || 0.0,
        costo_ponente: parseFloat(formData.costo_ponente) || 0.0,
      };

      // Filtrar y formatear sesiones
      const validSessions = sessions
        .filter((s) => s.id_speaker && Number(s.id_speaker) > 0)
        .map((s) => ({
          fecha: s.fecha || formData.fecha_inicio,
          hora_inicio: s.hora_inicio.length === 5 ? `${s.hora_inicio}:00` : s.hora_inicio,
          hora_fin: s.hora_fin.length === 5 ? `${s.hora_fin}:00` : s.hora_fin,
          titulo_sesion: s.titulo_sesion.trim(),
          jornada: String(s.jornada || "mañana").toLowerCase().trim(),
          lugar: (s.lugar || formData.lugar_sede || "Auditorio FISEI").trim(),
          id_speaker: parseInt(s.id_speaker, 10),
        }));

      // Filtrar y formatear patrocinadores
      const validSponsors = sponsors
        .filter((sp) => sp.id_sponsor && Number(sp.id_sponsor) > 0)
        .map((sp) => ({
          id_sponsor: parseInt(sp.id_sponsor, 10),
          categoria: String(sp.categoria || "oro").toLowerCase().trim(),
          aporte: Number(sp.aporte) || 0,
        }));

      if (isEdit) {
        await updateCongress(id, {
          congress: congressPayload,
          sponsors: validSponsors,
          sessions: validSessions,
        });
        toast.success("¡Congreso, sesiones y auspiciantes actualizados exitosamente!");
      } else {
        await createCongress({
          congress: congressPayload,
          sponsors: validSponsors,
          sessions: validSessions,
        });
        toast.success("¡Congreso publicado con éxito!");
      }

      navigate("/dashboard/congresos");
    } catch (err) {
      console.error("Error al guardar congreso:", err);
      const detail = err.response?.data?.detail;
      let msg = err.message || "Error al procesar el congreso";

      if (typeof detail === "string") {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail
          .map((d) => d.msg || (d.loc ? `${d.loc.slice(-1)[0]}: ${d.msg}` : JSON.stringify(d)))
          .join(" | ");
      } else if (err.response?.status === 400) {
        const str = JSON.stringify(err.response?.data || "");
        if (str.includes("already exists")) {
          msg = "Ya existe un congreso registrado con esta edición y año.";
        }
      }

      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploadingPoster(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00345e] border-t-transparent mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#00345e] dark:text-blue-400">
            Cargando información del congreso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Encabezado Superior Compacto (Notion Style) */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => navigate("/dashboard/congresos")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Congresos</span>
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {isEdit
              ? `Editar: ${formData.nombre || "Congreso"}`
              : "Crear Nuevo Congreso"}
          </h1>
        </div>

        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:inline shrink-0">
          Los cambios se guardan al publicar
        </span>
      </div>

      {/* Stepper / Mostradores Intuitivo (Notion Style) */}
      <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#16161a] p-2 shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {stepMeta.map((item) => {
            const number = item.step;
            const isActive = number === step;
            const isDone = number < step;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleStepClick(number)}
                className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#e6f3fe] dark:bg-[#00345e]/25 border-[#00345e]/30 dark:border-blue-500/40 text-[#00345e] dark:text-blue-200"
                    : isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    : "bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#00345e] text-white shadow-xs"
                      : isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.06]"
                  }`}
                >
                  {isDone ? (
                    <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    number
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive
                          ? "text-[#00345e] dark:text-blue-200"
                          : isDone
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 bg-[#00345e]/10 dark:bg-blue-400/20 text-[#00345e] dark:text-blue-300 rounded shrink-0 hidden md:inline">
                        Paso {number}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate hidden sm:block">
                    {item.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Barra de progreso sutil integrada */}
        <div className="mt-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between px-1 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>
            Progreso: {Math.round((step / 4) * 100)}% ({steps[step - 1].name})
          </span>
          <div className="w-24 sm:w-32 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
            <div
              className="h-full bg-[#00345e] dark:bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tarjeta Principal del Formulario */}
      <div
        className={`rounded-xl border transition-colors p-4 sm:p-5 shadow-2xs ${
          isDark ? "bg-[#16161a] border-white/[0.08]" : "bg-white border-black/[0.08]"
        }`}
      >
        {step === 1 && (
          <StepGeneralData
            formData={formData}
            onChange={handleChange}
            editionCheck={editionCheck}
            validationErrors={validationErrors}
            thematicTracks={thematicTracks}
            onAddTrack={handleAddTrack}
            onRemoveTrack={handleRemoveTrack}
            onChangeTrack={handleChangeTrack}
          />
        )}

        {step === 2 && (
          <StepDescriptionPoster
            formData={formData}
            onChange={handleChange}
            posterFile={posterFile}
            posterPreview={posterPreview}
            onPosterChange={handlePosterChange}
            uploadingPoster={uploadingPoster}
            validationErrors={validationErrors}
            targetAudiences={targetAudiences}
            onAddAudience={handleAddAudience}
            onRemoveAudience={handleRemoveAudience}
            onChangeAudience={handleChangeAudience}
          />
        )}

        {step === 3 && (
          <StepSessions
            sessions={sessions}
            onAddSession={handleAddSession}
            onRemoveSession={handleRemoveSession}
            onSessionChange={handleSessionChange}
            availableSpeakers={availableSpeakers}
            formData={formData}
            validationErrors={validationErrors}
            onOpenSpeakerModal={handleOpenSpeakerModal}
          />
        )}

        {step === 4 && (
          <StepSponsors
            sponsors={sponsors}
            onAddSponsor={handleAddSponsor}
            onRemoveSponsor={handleRemoveSponsor}
            onSponsorChange={handleSponsorChange}
            availableSponsors={availableSponsors}
            onOpenCreateSponsorModal={() => setIsSponsorModalOpen(true)}
            validationErrors={validationErrors}
          />
        )}
      </div>

      {/* Mensajes de Error si ocurren */}
      {submitError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs">
          <p className="font-semibold">Error al guardar:</p>
          <p className="mt-0.5">{submitError}</p>
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs">
          <p className="font-semibold">Hay campos incompletos o con formato inválido:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
            {Object.values(validationErrors)
              .slice(0, 4)
              .map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            {Object.keys(validationErrors).length > 4 && (
              <li>... y {Object.keys(validationErrors).length - 4} más</li>
            )}
          </ul>
        </div>
      )}

      {/* Espaciador para no tapar el final con la barra sticky */}
      <div className="h-6" />

      {/* Barra de Navegación Pegada al Fondo (Sticky Bottom Bar) */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between z-30 shadow-md">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || uploadingPoster || saving}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all cursor-pointer border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Atrás</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Paso {step} de 4:
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            {steps[step - 1].name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={uploadingPoster || saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] text-white rounded-lg transition-all font-medium text-xs sm:text-sm shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              <span>Continuar</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || uploadingPoster}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-xs sm:text-sm shadow-2xs cursor-pointer border-0"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : uploadingPoster ? (
                "Subiendo afiche..."
              ) : isEdit ? (
                "Guardar cambios"
              ) : (
                "Publicar congreso"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Modal para crear un patrocinador directamente sin salir */}
      <CreateSponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        onCreated={handleSponsorCreated}
      />

      {/* Modal para registrar un ponente directamente sin salir */}
      <CreateSpeakerModal
        isOpen={isSpeakerModalOpen}
        onClose={() => setIsSpeakerModalOpen(false)}
        onCreated={handleSpeakerCreated}
      />
    </div>
  );
}
