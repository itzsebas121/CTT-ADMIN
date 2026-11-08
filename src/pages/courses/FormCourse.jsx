import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  StepGeneralData,
  StepRequirements,
  StepContents,
  StepImages,
} from "../../components/courses";
import { useCourseData } from "../../hooks/useCourseData";
import { useCourseForm } from "../../hooks/useCourseForm";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { toast } from "react-toastify";

export default function FormCourse() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "crear");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { isDark } = useDashboardTheme();

  const steps = [
    { name: "Datos Generales", description: "Información básica y objetivos" },
    { name: "Requisitos", description: "Fechas, cupos, horarios y precios" },
    { name: "Contenido", description: "Módulos y temas de aprendizaje" },
    { name: "Imágenes", description: "Portada y material gráfico" },
  ];

  const { courseData, setCourseData, loading, error, originalImageUrls } =
    useCourseData(id, isEdit);

  const {
    saving,
    submitError,
    imageUploading,
    validationErrors,
    validateStep,
    handleCourseDataChange,
    handleCourseArrayChange,
    addCourseArrayItem,
    removeCourseArrayItem,
    handleRequirementsChange,
    handleRequirementsArrayChange,
    addRequirementsArrayItem,
    removeRequirementsArrayItem,
    handlePriceChange,
    addPrice,
    removePrice,
    handleContentChange,
    handleTopicChange,
    addModule,
    removeModule,
    addTopic,
    removeTopic,
    handleImageChange,
    handleSubmit,
  } = useCourseForm(courseData, setCourseData, isEdit, id, originalImageUrls);

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

  const onPublishClick = async () => {
    const result = await handleSubmit();
    if (result && !result.success && result.failedStep) {
      setStep(result.failedStep);
    }
  };

  const stepMeta = [
    { step: 1, label: "Información", sub: "Datos y objetivos", icon: BookOpenIcon },
    { step: 2, label: "Requisitos", sub: "Fechas y precios", icon: ClipboardDocumentListIcon },
    { step: 3, label: "Contenido", sub: "Módulos y temas", icon: Squares2X2Icon },
    { step: 4, label: "Imágenes", sub: "Portada y afiche", icon: PhotoIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00345e] border-t-transparent mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#00345e] dark:text-blue-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md mx-auto p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl">
          <h2 className="text-sm font-bold text-red-700 dark:text-red-300 mb-1.5">Error al cargar el curso</h2>
          <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard/cursos")}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition cursor-pointer"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Curso no encontrado</p>
          <button
            onClick={() => navigate("/dashboard/cursos")}
            className="mt-3 px-3.5 py-1.5 bg-[#00345e] hover:bg-[#002747] text-white font-medium text-xs rounded-lg transition cursor-pointer"
          >
            Volver
          </button>
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
            onClick={() => navigate("/dashboard/cursos")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Cursos</span>
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {isEdit
              ? `Editar: ${courseData?.course_data?.title || "Curso"}`
              : "Crear Nuevo Curso"}
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
                  {isDone ? <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : number}
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
          <span>Progreso: {Math.round((step / 4) * 100)}% ({steps[step - 1].name})</span>
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
            courseData={courseData.course_data}
            onChange={handleCourseDataChange}
            onArrayChange={handleCourseArrayChange}
            onAddArrayItem={addCourseArrayItem}
            onRemoveArrayItem={removeCourseArrayItem}
            validationErrors={validationErrors}
          />
        )}

        {step === 2 && (
          <StepRequirements
            requirementsData={courseData.requirements_data}
            onChange={handleRequirementsChange}
            onArrayChange={handleRequirementsArrayChange}
            onAddArrayItem={addRequirementsArrayItem}
            onRemoveArrayItem={removeRequirementsArrayItem}
            onPriceChange={handlePriceChange}
            onAddPrice={addPrice}
            onRemovePrice={removePrice}
            validationErrors={validationErrors}
          />
        )}

        {step === 3 && (
          <StepContents
            contentsData={courseData.contents_data}
            onContentChange={handleContentChange}
            onTopicChange={handleTopicChange}
            onAddModule={addModule}
            onRemoveModule={removeModule}
            onAddTopic={addTopic}
            onRemoveTopic={removeTopic}
            validationErrors={validationErrors}
          />
        )}

        {step === 4 && (
          <StepImages
            banner={courseData.course_data.course_image}
            detail={courseData.course_data.course_image_detail}
            onChangeImage={handleImageChange}
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
          disabled={step === 1 || imageUploading || saving}
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
              disabled={imageUploading || saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] text-white rounded-lg transition-all font-medium text-xs sm:text-sm shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              <span>Continuar</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPublishClick}
              disabled={saving || imageUploading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-xs sm:text-sm shadow-2xs cursor-pointer border-0"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : imageUploading ? (
                "Subiendo imágenes..."
              ) : isEdit ? (
                "Guardar cambios"
              ) : (
                "Publicar curso"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
