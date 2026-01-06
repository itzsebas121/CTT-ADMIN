import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import {
  StepGeneralData,
  StepRequirements,
  StepContents,
  StepImages
} from '../../components/courses'
import { StepNavigation } from '../../components/ui'
import { useCourseData } from '../../hooks/useCourseData'
import { useCourseForm } from '../../hooks/useCourseForm'

export default function FormCourse() {
  const { id } = useParams()
  const isEdit = Boolean(id && id !== 'crear')
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Definir los pasos del formulario
  const steps = [
    { name: 'Datos Generales', description: 'Información básica del curso' },
    { name: 'Requisitos', description: 'Requisitos y conocimientos previos' },
    { name: 'Contenido', description: 'Módulos y temas del curso' },
    { name: 'Imágenes', description: 'Imágenes y recursos visuales' }
  ];

  const { courseData, setCourseData, loading, error, originalImageUrls } = useCourseData(id, isEdit)
  
  const {
    saving,
    submitError,
    imageUploading,
    validationErrors,
    validateForm,
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
    handleSubmit
  } = useCourseForm(courseData, setCourseData, isEdit, id, originalImageUrls)

  const handleNextStep = () => {
    validateForm()
    setStep(step + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6C1313] mx-auto mb-4"></div>
          <p className="text-[#6C1313] text-lg">Cargando curso...</p>
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
              onClick={() => navigate('/courses')}
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
            onClick={() => navigate('/dashboard/cursos')}
            className="mt-4 bg-[#6C1313] hover:bg-[#5a0f0f] text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <button
                onClick={() => navigate('/dashboard/cursos')}
                className="flex items-center text-[#6C1313] hover:text-[#5a0f0f] transition-colors font-medium mb-5"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
            </button>
          <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}</h1>
          <p className="text-gray-600 mt-2">Complete la información del curso en los siguientes pasos</p>
        </div>

        {/* Step Navigation */}
        <StepNavigation 
          currentStep={step} 
          onStepChange={setStep} 
          steps={steps}
          accentColor="#6C1313"
          clickable={true}
        />

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {step === 1 && (
            <StepGeneralData
              courseData={courseData.course_data}
              onChange={handleCourseDataChange}
              onArrayChange={handleCourseArrayChange}
              onAddArrayItem={addCourseArrayItem}
              onRemoveArrayItem={removeCourseArrayItem}
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
            />
          )}

          {/* Step 4 now uses a component */}
          {step === 4 && (
            <StepImages
              banner={courseData.course_data.course_image}
              detail={courseData.course_data.course_image_detail}
              onChangeImage={handleImageChange}
            />
          )}
        </div>
        {/* Error message if submit fails */}
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Error al guardar</p>
            <p>{submitError}</p>
          </div>
        )}

        {/* Validation errors summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">⚠️ Hay campos incompletos o inválidos</p>
            <ul className="list-disc list-inside mt-2 text-sm">
              {Object.values(validationErrors).slice(0, 5).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
              {Object.keys(validationErrors).length > 5 && (
                <li>... y {Object.keys(validationErrors).length - 5} más</li>
              )}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || imageUploading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
          >
            ← Anterior
          </button>

          <div className="text-sm text-gray-600">
            {imageUploading ? 'Subiendo imagen...' : `Paso ${step} de 4`}
          </div>

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              disabled={imageUploading}
              className="px-6 py-3 bg-[#6C1313] hover:bg-[#5a0f0f] text-white rounded-lg transition font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || imageUploading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold shadow-lg"
            >
              {saving ? '⏳ Guardando...' : (imageUploading ? 'Espere, subiendo imagen...' : (isEdit ? '✓ Guardar Cambios' : '✓ Guardar Curso'))}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}