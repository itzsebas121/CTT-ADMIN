import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckIcon, BookOpenIcon, ClipboardDocumentListIcon, Squares2X2Icon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  StepGeneralData,
  StepRequirements,
  StepContents,
  StepImages,
} from "../../components/courses";
import { useCourseData } from "../../hooks/useCourseData";
import { useCourseForm } from "../../hooks/useCourseForm";
import { toast } from "react-toastify";

export default function FormCourse() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "crear");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Definir los pasos del formulario
  const steps = [
    { name: "Datos Generales", description: "Información básica del curso" },
    { name: "Requisitos", description: "Requisitos, fechas y cupos" },
    { name: "Contenido", description: "Módulos y temas del curso" },
    { name: "Imágenes", description: "Imágenes y recursos visuales" },
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
    { label: "Información", hint: "Presenta tu curso", icon: BookOpenIcon },
    { label: "Requisitos", hint: "Fechas, cupos y precios", icon: ClipboardDocumentListIcon },
    { label: "Contenido", hint: "Organiza el aprendizaje", icon: Squares2X2Icon },
    { label: "Imágenes", hint: "Hazlo reconocible", icon: PhotoIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-primary text-lg">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error al cargar el curso</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate("/dashboard/cursos")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Volver a Cursos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Curso no encontrado</p>
          <button
            onClick={() => navigate("/dashboard/cursos")}
            className="mt-4 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/cursos")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Volver a cursos
          </button>
          <span className="text-xs text-slate-400">Los cambios se guardan al publicar</span>
        </div>

        <main className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-5 overflow-x-auto" aria-label="Pasos del curso">
            {stepMeta.map((item, index) => {
              const number = index + 1;
              const done = number < step;
              return <button key={item.label} type="button" onClick={() => handleStepClick(number)} className={`shrink-0 flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${number === step ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                <span className="flex items-center justify-center gap-1.5">{done && <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />}{item.label}</span>
              </button>;
            })}
          </nav>

          <section className="mb-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-primary">Paso {step} de 4</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{stepMeta[step - 1].label}</h2>
                <p className="text-sm text-slate-500 mt-1">{steps[step - 1].description}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-400">Progreso</p>
                <p className="text-lg font-bold text-slate-800">{Math.round((step / 4) * 100)}%</p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="h-1 bg-slate-200 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 mb-5">
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

            {/* Mensaje de error general si falla submit */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-5 text-sm">
                <p className="font-bold">Error al guardar:</p>
                <p className="mt-0.5">{submitError}</p>
              </div>
            )}

            {/* Resumen de errores de validación */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-5 text-sm">
                <p className="font-bold">Hay campos incompletos o inválidos:</p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs">
                  {Object.values(validationErrors)
                    .slice(0, 5)
                    .map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  {Object.keys(validationErrors).length > 5 && (
                    <li>... y {Object.keys(validationErrors).length - 5} más</li>
                  )}
                </ul>
              </div>
            )}

            {/* Botones de Navegación */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1 || imageUploading || saving}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-semibold text-sm cursor-pointer"
              >
                Atrás
              </button>

              <div className="text-xs text-gray-500 font-medium">
                {imageUploading ? "Subiendo imagen..." : `Paso ${step} de 4`}
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={imageUploading || saving}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition font-semibold text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPublishClick}
                  disabled={saving || imageUploading}
                  className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          </section>
        </main>
      </div>
    </div>
  );
}
