import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { StepNavigation } from "../../components/ui";
import {
  getCongressById,
  createCongress,
  updateCongress,
  uploadCongressPoster,
  checkCongressEdition,
  getSponsorsList,
} from "../../api/congresses";
import api from "../../api/api";
import { toast } from "react-toastify";
import CreateSponsorModal from "../../components/congress/CreateSponsorModal";

export default function FormularioCongreso() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "crear");
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Modal para registrar una empresa patrocinadora en tiempo real
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [activeSponsorRowIndex, setActiveSponsorRowIndex] = useState(null);

  // Datos principales del congreso
  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    anio: new Date().getFullYear(),
    fecha_inicio: "",
    fecha_fin: "",
    descripcion_general: "",
    poster_cover_url: "",
  });

  // Estado para el póster
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Verificación de disponibilidad de edición y año
  const [editionCheck, setEditionCheck] = useState({
    checking: false,
    available: null,
    message: "",
  });

  // Sesiones de cronograma (opcional)
  const [sessions, setSessions] = useState([]);
  // Patrocinadores asociados (opcional)
  const [sponsors, setSponsors] = useState([]);

  // Catálogos reales del backend
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [availableSponsors, setAvailableSponsors] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const steps = [
    { name: "Datos Generales", description: "Identificación, edición y fechas" },
    { name: "Descripción y Portada", description: "Póster y contenido general" },
    { name: "Sesiones y Patrocinadores", description: "Cronograma y auspiciantes (opcional)" },
  ];

  // Cargar datos en modo edición
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
          });
          if (c.poster_cover_url) {
            setPosterPreview(c.poster_cover_url);
          }
          if (Array.isArray(data.sessions)) {
            setSessions(data.sessions);
          }
          if (Array.isArray(data.sponsors)) {
            setSponsors(data.sponsors);
          }
        } catch (err) {
          setError(`Error al cargar congreso: ${err.message}`);
          toast.error("No se pudo cargar el congreso.");
        } finally {
          setLoadingInitial(false);
        }
      };
      loadCongress();
    }
  }, [id, isEdit]);

  // Cargar catálogo de speakers y sponsors registrados
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [spkRes, spoList] = await Promise.allSettled([
          api.get("/speakers"),
          getSponsorsList(1, 100),
        ]);

        if (spkRes.status === "fulfilled" && spkRes.value?.data) {
          const list = spkRes.value.data.speakers || spkRes.value.data || [];
          setAvailableSpeakers(Array.isArray(list) ? list : []);
        }
        if (spoList.status === "fulfilled") {
          setAvailableSponsors(Array.isArray(spoList.value) ? spoList.value : []);
        }
      } catch (err) {
        console.warn("Error cargando catálogos auxiliares:", err);
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  // Verificar disponibilidad de edición y año en tiempo real
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
      [name]: name === "anio"
        ? (value === "" ? "" : (Number.isNaN(Number.parseInt(value, 10) ) ? "" : Number.parseInt(value, 10)))
        : value,
    }));
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
    }
  };

  // Validaciones rigurosas por paso (conforme a reglas Pydantic, controller y PostgreSQL)
  const validateStep = (step) => {
    if (step === 1) {
      const name = formData.nombre.trim();
      if (!name || name.length < 3) {
        toast.warning("El nombre del congreso debe tener al menos 3 caracteres.");
        return false;
      }
      if (name.length > 100) {
        toast.warning("El nombre del congreso no puede superar los 100 caracteres.");
        return false;
      }

      const ed = formData.edicion.trim();
      if (!ed) {
        toast.warning("La edición del congreso es obligatoria.");
        return false;
      }
      if (ed.length > 10) {
        toast.warning("La edición del congreso no puede superar los 10 caracteres.");
        return false;
      }

      const year = parseInt(formData.anio, 10);
      if (isNaN(year) || year < 2000 || year > 2100) {
        toast.warning("El año del congreso debe estar entre 2000 y 2100.");
        return false;
      }

      if (!formData.fecha_inicio) {
        toast.warning("La fecha de inicio es obligatoria.");
        return false;
      }
      if (!formData.fecha_fin) {
        toast.warning("La fecha de finalización es obligatoria.");
        return false;
      }
      if (formData.fecha_fin <= formData.fecha_inicio) {
        toast.warning("La fecha de finalización debe ser posterior a la fecha de inicio.");
        return false;
      }

      if (editionCheck.available === false) {
        toast.error("Ya existe un congreso con esta edición y año. Elige otra edición o año.");
        return false;
      }
    }

    if (step === 2) {
      const desc = formData.descripcion_general.trim();
      if (!desc || desc.length < 5) {
        toast.warning("La descripción general es obligatoria (mínimo 5 caracteres).");
        return false;
      }

      if (!posterFile && !formData.poster_cover_url.trim()) {
        toast.warning("El póster o portada es obligatorio. Sube una imagen o ingresa una URL.");
        return false;
      }

      if (formData.poster_cover_url && formData.poster_cover_url.trim().length > 300) {
        toast.warning("La URL del póster no puede superar los 300 caracteres.");
        return false;
      }

      if (!posterFile && formData.poster_cover_url.trim()) {
        try {
          const url = new URL(formData.poster_cover_url.trim());
          if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
            throw new Error();
          }
        } catch {
          toast.warning("Ingresa una URL válida que comience con http:// o https://.");
          return false;
        }
      }
    }

    if (step === 3) {
      // 1. Validar Patrocinadores si se agregaron filas
      if (sponsors.length > 0) {
        const emptySponsor = sponsors.find((sp) => !sp.id_sponsor);
        if (emptySponsor) {
          toast.warning("Selecciona una empresa para cada patrocinador agregado, o elimina la fila.");
          return false;
        }

        const sponsorIds = sponsors.map((sp) => Number(sp.id_sponsor));
        if (new Set(sponsorIds).size !== sponsorIds.length) {
          toast.warning("No puedes asignar la misma empresa patrocinadora más de una vez.");
          return false;
        }

        const validCats = ["platino", "oro", "plata", "bronce", "colaborador"];
        const invalidCat = sponsors.find(
          (sp) => !validCats.includes(String(sp.categoria || "").toLowerCase().trim())
        );
        if (invalidCat) {
          toast.warning("La categoría debe ser una de: platino, oro, plata, bronce, colaborador.");
          return false;
        }

        const invalidAporte = sponsors.find((sp) => {
          const a = Number(sp.aporte);
          return isNaN(a) || a < 0 || a > 999999.99;
        });
        if (invalidAporte) {
          toast.warning("El aporte de cada patrocinador debe estar entre 0 y 999,999.99.");
          return false;
        }
      }

      // 2. Validar Sesiones si se agregaron filas
      if (sessions.length > 0) {
        const missingSpeaker = sessions.find((s) => !s.id_speaker);
        if (missingSpeaker) {
          toast.warning("Debes seleccionar un ponente para cada sesión agregada, o elimina la fila.");
          return false;
        }

        const invalidTitle = sessions.find(
          (s) =>
            !s.titulo_sesion ||
            s.titulo_sesion.trim().length < 5 ||
            s.titulo_sesion.trim().length > 200
        );
        if (invalidTitle) {
          toast.warning("El título de cada sesión debe tener entre 5 y 200 caracteres.");
          return false;
        }

        const invalidLugar = sessions.find(
          (s) => !s.lugar || s.lugar.trim().length < 3 || s.lugar.trim().length > 150
        );
        if (invalidLugar) {
          toast.warning("El lugar de cada sesión debe tener entre 3 y 150 caracteres.");
          return false;
        }

        const invalidDate = sessions.find(
          (s) => !s.fecha || s.fecha < formData.fecha_inicio || s.fecha > formData.fecha_fin
        );
        if (invalidDate) {
          toast.warning(
            `La fecha de cada sesión debe estar dentro del rango del congreso (${formData.fecha_inicio} al ${formData.fecha_fin}).`
          );
          return false;
        }

        const invalidTime = sessions.find(
          (s) => !s.hora_inicio || !s.hora_fin || s.hora_fin <= s.hora_inicio
        );
        if (invalidTime) {
          toast.warning("La hora de fin de cada sesión debe ser posterior a la hora de inicio.");
          return false;
        }

        const validJornadas = ["mañana", "tarde", "noche"];
        const invalidJornada = sessions.find(
          (s) => !validJornadas.includes(String(s.jornada || "").toLowerCase().trim())
        );
        if (invalidJornada) {
          toast.warning("La jornada debe ser una de: mañana, tarde, noche.");
          return false;
        }
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Manejo de Sesiones
  const handleAddSession = () => {
    if (availableSpeakers.length === 0) {
      toast.info(
        "No hay ponentes registrados todavía en el catálogo. Podrás agendar sesiones tras registrar ponentes."
      );
      return;
    }

    setSessions((prev) => [
      ...prev,
      {
        titulo_sesion: "",
        lugar: "Auditorio Principal",
        fecha: formData.fecha_inicio || "",
        hora_inicio: "09:00",
        hora_fin: "10:30",
        jornada: "mañana",
        id_speaker: availableSpeakers[0].id_speaker || availableSpeakers[0].id,
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
      // Si no hay empresas registradas en la base de datos, abrir modal de creación
      setActiveSponsorRowIndex(null);
      setIsSponsorModalOpen(true);
      return;
    }

    // Buscar una empresa que aún no haya sido asignada en la lista
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
      setActiveSponsorRowIndex(null);
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

  // Callback ejecutado tras crear un patrocinador real en la base de datos
  const handleSponsorCreated = (newSponsor) => {
    const newId = newSponsor.id_sponsor || newSponsor.id;
    setAvailableSponsors((prev) => [newSponsor, ...prev]);

    if (activeSponsorRowIndex !== null && sponsors[activeSponsorRowIndex]) {
      handleSponsorChange(activeSponsorRowIndex, "id_sponsor", newId);
    } else {
      setSponsors((prev) => [
        ...prev,
        {
          id_sponsor: newId,
          categoria: "oro",
          aporte: 1000,
        },
      ]);
    }
    setActiveSponsorRowIndex(null);
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    if (editionCheck.checking) {
      toast.info("Verificando disponibilidad de edición y año...");
      return;
    }
    if (editionCheck.available === false) {
      toast.error("Ya existe un congreso con esta edición y año.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let finalPosterUrl = formData.poster_cover_url.trim();

      if (posterFile) {
        setUploadingPoster(true);
        const uploadRes = await uploadCongressPoster(posterFile);
        finalPosterUrl = uploadRes.image_url || uploadRes.url || finalPosterUrl;
        setUploadingPoster(false);
      }

      if (!finalPosterUrl) {
        toast.warning("La imagen de portada es obligatoria.");
        setSaving(false);
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
      };

      if (isEdit) {
        await updateCongress(id, { congress: congressPayload });
        toast.success("Congreso actualizado exitosamente");
      } else {
        // Filtrar y estructurar sesiones
        const validSessions = sessions
          .filter((s) => s.id_speaker && Number(s.id_speaker) > 0)
          .map((s) => ({
            fecha: s.fecha || formData.fecha_inicio,
            hora_inicio:
              s.hora_inicio.length === 5 ? `${s.hora_inicio}:00` : s.hora_inicio,
            hora_fin:
              s.hora_fin.length === 5 ? `${s.hora_fin}:00` : s.hora_fin,
            titulo_sesion: s.titulo_sesion.trim(),
            jornada: String(s.jornada || "mañana").toLowerCase().trim(),
            lugar: s.lugar.trim(),
            id_speaker: parseInt(s.id_speaker, 10),
          }));

        // Filtrar y estructurar patrocinadores
        const validSponsors = sponsors
          .filter((sp) => sp.id_sponsor && Number(sp.id_sponsor) > 0)
          .map((sp) => ({
            id_sponsor: parseInt(sp.id_sponsor, 10),
            categoria: String(sp.categoria || "oro").toLowerCase().trim(),
            aporte: Number(sp.aporte) || 0,
          }));

        await createCongress({
          congress: congressPayload,
          sponsors: validSponsors,
          sessions: validSessions,
        });
        toast.success("¡Congreso creado con éxito!");
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
        } else if (str.includes("Duplicate id_sponsor")) {
          msg = "No puedes repetir un patrocinador en el mismo evento.";
        } else if (str.includes("outside the congress date range")) {
          msg = "La fecha de una sesión está fuera del rango de fechas del congreso.";
        }
      } else if (err.response?.status === 404) {
        const str = JSON.stringify(err.response?.data || "");
        if (str.includes("Sponsor")) {
          msg = "Uno de los patrocinadores seleccionados ya no existe en el catálogo.";
        } else if (str.includes("Speaker")) {
          msg = "Uno de los ponentes seleccionados ya no existe en el catálogo.";
        }
      } else if (err.response?.status === 500) {
        msg = "Error 500 del servidor: Posible longitud excesiva de texto en base de datos. Verifica nombres, títulos y URLs.";
      }

      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploadingPoster(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-primary text-base font-medium">Cargando datos del congreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header superior */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/congresos")}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              title="Volver a la lista"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEdit ? "Editar Congreso" : "Crear Nuevo Congreso"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {isEdit
                  ? `Modificando detalles del congreso #${id}`
                  : "Completa los pasos para publicar un nuevo evento académico"}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper de navegación */}
        <StepNavigation
          currentStep={currentStep}
          onStepChange={(stepNum) => {
            if (stepNum < currentStep || validateStep(currentStep)) {
              setCurrentStep(stepNum);
            }
          }}
          steps={steps}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold">Error al guardar:</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Contenedor del paso activo */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sm:p-8">
          {/* PASO 1: Datos Generales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                1. Información Básica del Evento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                    <span>
                      Nombre del Congreso <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      ({formData.nombre.length}/100)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    maxLength={100}
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Congreso Internacional de Tecnologías de la Información"
                    required
                    minLength={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  />
                </div>

                {/* Edición */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                    <span>
                      Edición <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      ({formData.edicion.length}/10)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="edicion"
                    maxLength={10}
                    value={formData.edicion}
                    onChange={handleChange}
                    placeholder="Ej: I, II, 3ra, 2026"
                    required
                    minLength={1}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  />
                  {editionCheck.checking ? (
                    <p className="text-xs text-gray-400 mt-1">Verificando disponibilidad...</p>
                  ) : editionCheck.available === true ? (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 inline" /> {editionCheck.message}
                    </p>
                  ) : editionCheck.available === false ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-4 h-4 inline" /> {editionCheck.message}
                    </p>
                  ) : null}
                </div>

                {/* Año */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                    <span>
                      Año <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400 font-normal">(2000 - 2100)</span>
                  </label>
                  <input
                    type="number"
                    name="anio"
                    min="2000"
                    max="2100"
                    value={formData.anio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  />
                </div>

                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Fecha de Inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Fecha de Finalización <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_fin"
                    min={formData.fecha_inicio || undefined}
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Debe ser posterior a la fecha de inicio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Descripción y Portada */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                2. Descripción y Recursos Gráficos
              </h2>

              {/* Descripción general */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                  <span>
                    Descripción General <span className="text-red-500">*</span>
                  </span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({formData.descripcion_general.length}/2000)
                  </span>
                </label>
                <textarea
                  name="descripcion_general"
                  maxLength={2000}
                  rows={6}
                  value={formData.descripcion_general}
                  onChange={handleChange}
                  placeholder="Detalla la temática del congreso, sus objetivos, público objetivo, líneas de investigación..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-y"
                />
              </div>

              {/* Póster / Portada */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Póster / Portada del Congreso <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
                  {/* Vista previa */}
                  <div className="aspect-[4/3] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center p-4 relative group">
                    {posterPreview ? (
                      <>
                        <img
                          src={posterPreview}
                          alt="Póster del congreso"
                          className="w-full h-full object-cover rounded-xl"
                          onError={() => setPosterPreview("")}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <label
                            htmlFor="poster-upload"
                            className="px-3.5 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            Cambiar imagen
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400">
                        <PhotoIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium">Ninguna imagen seleccionada</p>
                        <p className="text-xs text-gray-400 mt-0.5">Sube un archivo o ingresa una URL</p>
                      </div>
                    )}
                  </div>

                  {/* Selector y URL */}
                  <div className="space-y-4">
                    <div>
                      <span className="block text-xs font-semibold text-gray-600 mb-1">
                        Subir archivo local:
                      </span>
                      <input
                        id="poster-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePosterChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Formatos soportados: JPG, PNG, WEBP. Máx. 5MB.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <label className="block text-xs font-semibold text-gray-600 mb-1 flex justify-between">
                        <span>O ingresa URL directa de la imagen:</span>
                        <span className="text-gray-400 font-normal">
                          ({formData.poster_cover_url.length}/300)
                        </span>
                      </label>
                      <input
                        type="url"
                        name="poster_cover_url"
                        maxLength={300}
                        value={formData.poster_cover_url}
                        onChange={(e) => {
                          handleChange(e);
                          if (!posterFile) setPosterPreview(e.target.value);
                        }}
                        placeholder="https://ejemplo.com/poster.jpg"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Sesiones y Patrocinadores */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    3. Sesiones de Cronograma y Patrocinadores (Opcional)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Este paso es 100% opcional. Si no deseas asignar sesiones ni empresas auspiciantes ahora, puedes omitirlo y hacer clic en <strong>"Crear Congreso"</strong>.
                  </p>
                </div>
              </div>

              {/* SECCIÓN PATROCINADORES */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      Patrocinadores (Auspiciantes)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Empresas u organizaciones reales que colaboran con el evento.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSponsorRowIndex(null);
                        setIsSponsorModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <BuildingOffice2Icon className="w-4 h-4" /> Registrar Nueva Empresa
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSponsor}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <PlusIcon className="w-4 h-4" /> + Asignar Patrocinador
                    </button>
                  </div>
                </div>

                {availableSponsors.length === 0 ? (
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <InformationCircleIcon className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900">Catálogo de empresas vacío</p>
                        <p className="text-blue-700 mt-0.5">
                          Para vincular un auspiciante debe existir previamente en el catálogo oficial de empresas. Puedes registrar una ahora mismo o crear el congreso directamente sin patrocinadores.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSponsorRowIndex(null);
                        setIsSponsorModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0 cursor-pointer text-center"
                    >
                      + Registrar Empresa Ahora
                    </button>
                  </div>
                ) : sponsors.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-400 text-sm border border-dashed border-gray-200">
                    No has asignado patrocinadores aún (opcional). Haz clic en <strong>"+ Asignar Patrocinador"</strong> para vincular una empresa.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sponsors.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                      >
                        {/* Selector de Empresa */}
                        <div className="md:col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center justify-between">
                            <span>Empresa Patrocinadora <span className="text-red-500">*</span></span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSponsorRowIndex(idx);
                                setIsSponsorModalOpen(true);
                              }}
                              className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                            >
                              + Nueva Empresa
                            </button>
                          </label>
                          <select
                            value={sp.id_sponsor || ""}
                            onChange={(e) =>
                              handleSponsorChange(
                                idx,
                                "id_sponsor",
                                e.target.value ? parseInt(e.target.value, 10) : ""
                              )
                            }
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            <option value="">-- Selecciona una empresa del catálogo --</option>
                            {availableSponsors.map((spo) => {
                              const spoId = spo.id_sponsor || spo.id;
                              const isTaken = sponsors.some(
                                (s, sIdx) => sIdx !== idx && Number(s.id_sponsor) === Number(spoId)
                              );
                              return (
                                <option key={spoId} value={spoId} disabled={isTaken}>
                                  {spo.nombre} {isTaken ? "(Ya seleccionada)" : ""}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Categoría Patrocinio */}
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Categoría Patrocinio
                          </label>
                          <select
                            value={sp.categoria || "oro"}
                            onChange={(e) =>
                              handleSponsorChange(idx, "categoria", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            <option value="platino">Platino</option>
                            <option value="oro">Oro</option>
                            <option value="plata">Plata</option>
                            <option value="bronce">Bronce</option>
                            <option value="colaborador">Colaborador</option>
                          </select>
                        </div>

                        {/* Aporte ($) */}
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Aporte ($) (0 - 999,999.99)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="999999.99"
                            step="0.01"
                            required
                            value={sp.aporte}
                            onChange={(e) =>
                              handleSponsorChange(idx, "aporte", e.target.value)
                            }
                            placeholder="Ej: 1000.00"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>

                        {/* Botón Eliminar */}
                        <div className="md:col-span-1 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveSponsor(idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar patrocinador"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECCIÓN CRONOGRAMA */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      Sesiones del Cronograma
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ponencias y conferencias que formarán parte de la agenda.
                    </p>
                  </div>
                  {availableSpeakers.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAddSession}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <PlusIcon className="w-4 h-4" /> Agregar Sesión
                    </button>
                  )}
                </div>

                {availableSpeakers.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-start gap-2.5">
                    <InformationCircleIcon className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Catálogo de Ponentes vacío para sesiones iniciales</p>
                      <p className="text-gray-500 mt-0.5">
                        En el sistema, los ponentes se registran vinculados al congreso. Puedes crear el congreso ahora (las sesiones son opcionales) y posteriormente agregar los ponentes y su cronograma desde el detalle del congreso.
                      </p>
                    </div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-400 text-sm border border-dashed border-gray-200">
                    No has agregado sesiones aún (opcional). Haz clic en <strong>"Agregar Sesión"</strong> si deseas incluir ponencias iniciales.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((sess, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                          <span className="text-xs font-bold text-gray-700">
                            Sesión #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSession(idx)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar sesión"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          {/* Título de la sesión */}
                          <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-600 mb-1 flex justify-between">
                              <span>Título de la Sesión <span className="text-red-500">*</span></span>
                              <span className="text-gray-400 font-normal">
                                ({sess.titulo_sesion?.length || 0}/200)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={sess.titulo_sesion}
                              onChange={(e) =>
                                handleSessionChange(idx, "titulo_sesion", e.target.value)
                              }
                              placeholder="Ej: Keynote: Inteligencia Artificial en la Educación"
                              minLength={5}
                              maxLength={200}
                              required
                              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                            />
                          </div>

                          {/* Lugar / Auditorio */}
                          <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1 flex justify-between">
                              <span>Lugar / Auditorio <span className="text-red-500">*</span></span>
                              <span className="text-gray-400 font-normal">
                                ({sess.lugar?.length || 0}/150)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={sess.lugar}
                              onChange={(e) =>
                                handleSessionChange(idx, "lugar", e.target.value)
                              }
                              placeholder="Ej: Auditorio Principal, Sala Magna"
                              minLength={3}
                              maxLength={150}
                              required
                              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                            />
                          </div>

                          {/* Ponente */}
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Ponente <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={sess.id_speaker || ""}
                              onChange={(e) =>
                                handleSessionChange(
                                  idx,
                                  "id_speaker",
                                  e.target.value ? parseInt(e.target.value, 10) : ""
                                )
                              }
                              required
                              className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                            >
                              <option value="">Selecciona ponente...</option>
                              {availableSpeakers.map((spk) => (
                                <option
                                  key={spk.id_speaker || spk.id}
                                  value={spk.id_speaker || spk.id}
                                >
                                  {spk.nombres_completos || spk.nombre || `Ponente #${spk.id_speaker || spk.id}`}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Fecha */}
                          <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Fecha de Sesión <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              required
                              min={formData.fecha_inicio || undefined}
                              max={formData.fecha_fin || undefined}
                              value={sess.fecha}
                              onChange={(e) =>
                                handleSessionChange(idx, "fecha", e.target.value)
                              }
                              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                            />
                          </div>

                          {/* Horario */}
                          <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Horario (Inicio - Fin) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="time"
                                required
                                value={sess.hora_inicio?.substring(0, 5)}
                                onChange={(e) =>
                                  handleSessionChange(idx, "hora_inicio", e.target.value)
                                }
                                className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                              />
                              <span className="text-gray-400 text-xs">-</span>
                              <input
                                type="time"
                                required
                                value={sess.hora_fin?.substring(0, 5)}
                                onChange={(e) =>
                                  handleSessionChange(idx, "hora_fin", e.target.value)
                                }
                                className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          {/* Jornada */}
                          <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Jornada
                            </label>
                            <select
                              value={sess.jornada || "mañana"}
                              onChange={(e) =>
                                handleSessionChange(idx, "jornada", e.target.value)
                              }
                              className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                            >
                              <option value="mañana">Mañana</option>
                              <option value="tarde">Tarde</option>
                              <option value="noche">Noche</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de navegación inferior */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors cursor-pointer"
              >
                Anterior
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || uploadingPoster}
                  className="inline-flex items-center justify-center px-7 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving || uploadingPoster ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {uploadingPoster ? "Subiendo póster..." : "Guardando..."}
                    </>
                  ) : isEdit ? (
                    "Guardar Cambios"
                  ) : (
                    "Crear Congreso"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Registrar Empresa en Catálogo de Patrocinadores */}
      <CreateSponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        onCreated={handleSponsorCreated}
      />
    </div>
  );
}
