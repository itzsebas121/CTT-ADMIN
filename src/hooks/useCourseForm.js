import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCourse, updateCourse, uploadImage, deleteImage } from '../api/courses'
import { toast } from 'react-toastify'

export const useCourseForm = (courseData, setCourseData, isEdit, id, originalImageUrls) => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [pendingImages, setPendingImages] = useState({
    course_image: null,
    course_image_detail: null
  })
  const [validationErrors, setValidationErrors] = useState({})

  // General Data handlers
  const handleCourseDataChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      course_data: {
        ...prev.course_data,
        [field]: value
      }
    }))
    // Clear specific error if fixed
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleCourseArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      course_data: {
        ...prev.course_data,
        [field]: prev.course_data[field].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const addCourseArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      course_data: {
        ...prev.course_data,
        [field]: [...prev.course_data[field], '']
      }
    }))
  }

  const removeCourseArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      course_data: {
        ...prev.course_data,
        [field]: prev.course_data[field].filter((_, i) => i !== index)
      }
    }))
  }

  // Requirements handlers
  const handleRequirementsChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        [field]: value
      }
    }))
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleRequirementsArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        [field]: prev.requirements_data[field].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const addRequirementsArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        [field]: [...prev.requirements_data[field], '']
      }
    }))
  }

  const removeRequirementsArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        [field]: prev.requirements_data[field].filter((_, i) => i !== index)
      }
    }))
  }

  const handlePriceChange = (index, field, value) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        prices: prev.requirements_data.prices.map((price, i) =>
          i === index ? { ...price, [field]: value } : price
        )
      }
    }))
    if (validationErrors.prices) {
      setValidationErrors(prev => {
        const copy = { ...prev }
        delete copy.prices
        return copy
      })
    }
  }

  const addPrice = () => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        prices: [...prev.requirements_data.prices, { amount: 0, category: '' }]
      }
    }))
  }

  const removePrice = (index) => {
    setCourseData(prev => ({
      ...prev,
      requirements_data: {
        ...prev.requirements_data,
        prices: prev.requirements_data.prices.filter((_, i) => i !== index)
      }
    }))
  }

  // Contents handlers
  const handleContentChange = (index, field, value) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.map((content, i) =>
        i === index ? { ...content, [field]: value } : content
      )
    }))
  }

  const handleTopicChange = (moduleIndex, topicIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.map((content, i) =>
        i === moduleIndex ? {
          ...content,
          topics: content.topics.map((topic, j) =>
            j === topicIndex ? { ...topic, [field]: value } : topic
          )
        } : content
      )
    }))
  }

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      contents_data: [
        ...prev.contents_data,
        {
          unit: `Módulo ${prev.contents_data.length + 1}`,
          title: '',
          topics: [{ unit: 'Tema 1', title: '' }]
        }
      ]
    }))
  }

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.filter((_, i) => i !== index)
    }))
  }

  const addTopic = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.map((content, i) =>
        i === moduleIndex ? {
          ...content,
          topics: [
            ...content.topics,
            { unit: `Tema ${content.topics.length + 1}`, title: '' }
          ]
        } : content
      )
    }))
  }

  const removeTopic = (moduleIndex, topicIndex) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.map((content, i) =>
        i === moduleIndex ? {
          ...content,
          topics: content.topics.filter((_, j) => j !== topicIndex)
        } : content
      )
    }))
  }

  const handleImageChange = async (field, file) => {
    if (!file) return
    setPendingImages(prev => ({
      ...prev,
      [field]: file
    }))
    const tempUrl = URL.createObjectURL(file)
    handleCourseDataChange(field, tempUrl)
  }

  /**
   * Valida un paso específico del formulario.
   * @param {number} stepNumber - 1, 2, 3 o 4
   * @returns {boolean} true si el paso es válido
   */
  const validateStep = (stepNumber) => {
    const errors = {}

    // Paso 1: Datos Generales
    if (stepNumber === 1) {
      if (!courseData.course_data.title?.trim()) {
        errors.title = 'El título del curso es requerido'
      } else if (courseData.course_data.title.trim().length < 3) {
        errors.title = 'El título debe tener al menos 3 caracteres'
      }

      if (!courseData.course_data.description?.trim()) {
        errors.description = 'La descripción del curso es requerida'
      }

      if (!courseData.course_data.category_id) {
        errors.category_id = 'Debes seleccionar una categoría'
      }

      if (!courseData.course_data.place?.trim()) {
        errors.place = 'El lugar o campus es requerido'
      }

      const arrayFields = ['objectives', 'organizers', 'materials', 'target_audience']
      arrayFields.forEach(field => {
        const arr = courseData.course_data[field]
        if (!arr || arr.length === 0 || arr.every(item => !item?.trim())) {
          errors[field] = `Debe agregar al menos un ${
            field === 'objectives' ? 'objetivo' :
            field === 'organizers' ? 'organizador' :
            field === 'materials' ? 'material' : 'público objetivo'
          }`
        }
      })
    }

    // Paso 2: Requisitos y Cupos
    if (stepNumber === 2) {
      const req = courseData.requirements_data

      if (!req.start_date_registration) {
        errors.start_date_registration = 'La fecha de inicio de inscripción es requerida'
      }
      if (!req.end_date_registration) {
        errors.end_date_registration = 'La fecha de fin de inscripción es requerida'
      }
      if (req.start_date_registration && req.end_date_registration) {
        if (req.end_date_registration < req.start_date_registration) {
          errors.end_date_registration = 'La fecha de fin de inscripción no puede ser anterior a la de inicio'
        }
      }

      if (!req.start_date_course) {
        errors.start_date_course = 'La fecha de inicio del curso es requerida'
      }
      if (!req.end_date_course) {
        errors.end_date_course = 'La fecha de fin del curso es requerida'
      }
      if (req.start_date_course && req.end_date_course) {
        if (req.end_date_course < req.start_date_course) {
          errors.end_date_course = 'La fecha de fin del curso no puede ser anterior a la de inicio'
        }
      }

      if (!req.days || req.days.length === 0 || req.days.every(d => !d?.trim())) {
        errors.days = 'Debe seleccionar al menos un día de clase'
      }
      if (!req.start_time) {
        errors.start_time = 'La hora de inicio es requerida'
      }
      if (!req.end_time) {
        errors.end_time = 'La hora de fin es requerida'
      }
      if (req.start_time && req.end_time) {
        if (req.end_time <= req.start_time) {
          errors.end_time = 'La hora de fin debe ser posterior a la hora de inicio'
        }
      }

      if (!req.location?.trim()) {
        errors.location = 'La ubicación es requerida'
      }
      if (!req.modality?.trim()) {
        errors.modality = 'La modalidad es requerida'
      }
      if (!req.certification?.trim()) {
        errors.certification = 'La certificación es requerida'
      }

      // Validación numérica estricta de cupos
      const minQuota = Number(req.min_quota)
      const maxQuota = Number(req.max_quota)

      const isMinInvalid = req.min_quota === '' || req.min_quota === null || req.min_quota === undefined || isNaN(minQuota) || minQuota < 1
      const isMaxInvalid = req.max_quota === '' || req.max_quota === null || req.max_quota === undefined || isNaN(maxQuota) || maxQuota < 1

      if (isMinInvalid) {
        errors.min_quota = 'El cupo mínimo debe ser al menos 1'
      }
      if (isMaxInvalid) {
        errors.max_quota = 'El cupo máximo debe ser al menos 1'
      }

      if (!isMinInvalid && !isMaxInvalid) {
        if (minQuota > maxQuota) {
          errors.min_quota = 'El cupo mínimo no puede ser mayor al cupo máximo'
          errors.max_quota = 'El cupo máximo debe ser mayor o igual al cupo mínimo'
        }
      }

      // Prerrequisitos
      if (!req.prerequisites || req.prerequisites.length === 0 || req.prerequisites.every(p => !p?.trim())) {
        errors.prerequisites = 'Debe agregar al menos un prerrequisito'
      }

      // Precios
      if (!req.prices || req.prices.length === 0) {
        errors.prices = 'Debe agregar al menos un precio'
      } else {
        const invalidPrices = req.prices.some(
          p => !p.category?.trim() || isNaN(Number(p.amount)) || Number(p.amount) < 0
        )
        if (invalidPrices) {
          errors.prices = 'Todos los precios deben tener categoría y un monto válido'
        }
      }
    }

    // Paso 3: Contenido
    if (stepNumber === 3) {
      if (!courseData.contents_data || courseData.contents_data.length === 0) {
        errors.contents = 'Debe agregar al menos un módulo'
      } else {
        const hasInvalidModule = courseData.contents_data.some(module =>
          !module.title?.trim() ||
          !module.topics || module.topics.length === 0 ||
          module.topics.some(topic => !topic.title?.trim())
        )
        if (hasInvalidModule) {
          errors.contents = 'Todos los módulos deben tener título y al menos un tema completo'
        }
      }
    }

    // Paso 4: Imágenes
    if (stepNumber === 4) {
      if (!courseData.course_data.course_image && !pendingImages.course_image) {
        errors.course_image = 'La imagen del banner es requerida'
      }
      if (!courseData.course_data.course_image_detail && !pendingImages.course_image_detail) {
        errors.course_image_detail = 'La imagen de detalle es requerida'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Valida todo el formulario y retorna si es válido y cuál es el primer paso con errores.
   */
  const validateForm = () => {
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        return { valid: false, failedStep: s }
      }
    }
    setValidationErrors({})
    return { valid: true, failedStep: null }
  }

  const handleSubmit = async () => {
    const check = validateForm()
    if (!check.valid) {
      setSubmitError('Por favor, complete todos los campos requeridos correctamente.')
      toast.warning(`Revisa los campos requeridos en el Paso ${check.failedStep}`)
      return { success: false, failedStep: check.failedStep }
    }

    setSaving(true)
    setSubmitError(null)

    try {
      const imageUrls = { ...courseData.course_data }

      if (pendingImages.course_image || pendingImages.course_image_detail) {
        toast.info('Subiendo imágenes...', {
          position: "top-right",
          autoClose: 2000,
        })
      }

      for (const field of ['course_image', 'course_image_detail']) {
        if (pendingImages[field]) {
          setImageUploading(true)

          if (isEdit && originalImageUrls[field]) {
            try {
              await deleteImage(originalImageUrls[field])
            } catch {
              // Ignorar error al borrar imagen previa
            }
          }

          const uploaded = await uploadImage(pendingImages[field])
          const newUrl = uploaded?.url || uploaded?.image_url || uploaded?.path
          if (!newUrl) throw new Error(`No se recibió una URL válida para ${field}`)
          imageUrls[field] = newUrl
        }
      }

      setImageUploading(false)

      const uiStatus = String(courseData.course_data.status || '').toLowerCase()
      const normalizedStatus = uiStatus === 'activo' ? 'activo' : uiStatus === 'cerrado' ? 'inactivo' : uiStatus

      const minQuota = parseInt(courseData.requirements_data.min_quota, 10)
      const maxQuota = parseInt(courseData.requirements_data.max_quota, 10)
      const inPersonHours = parseInt(courseData.requirements_data.in_person_hours, 10) || 0
      const autonomousHours = parseInt(courseData.requirements_data.autonomous_hours, 10) || 0
      const categoryId = parseInt(courseData.course_data.category_id, 10)

      const formatTime = (timeStr) => {
        if (!timeStr) return timeStr
        const trimmed = timeStr.trim()
        return trimmed.length === 5 ? `${trimmed}:00` : trimmed
      }

      const cleanContents = (courseData.contents_data || []).map((m, idx) => ({
        unit: m.unit?.trim() || `Módulo ${idx + 1}`,
        title: m.title?.trim() || `Módulo ${idx + 1}`,
        topics: (m.topics || []).map((t, tIdx) => ({
          unit: t.unit?.trim() || `Tema ${tIdx + 1}`,
          title: t.title?.trim() || `Tema ${tIdx + 1}`
        }))
      }))

      const cleanPrices = (courseData.requirements_data.prices || []).map(p => ({
        amount: Number(p.amount) || 0,
        category: p.category?.trim() || 'General'
      }))

      const cleanPrerequisites = (courseData.requirements_data.prerequisites || [])
        .map(p => (typeof p === 'string' ? p.trim() : ''))
        .filter(Boolean)

      const cleanObjectives = (courseData.course_data.objectives || [])
        .map(p => (typeof p === 'string' ? p.trim() : ''))
        .filter(Boolean)

      const cleanOrganizers = (courseData.course_data.organizers || [])
        .map(p => (typeof p === 'string' ? p.trim() : ''))
        .filter(Boolean)

      const cleanMaterials = (courseData.course_data.materials || [])
        .map(p => (typeof p === 'string' ? p.trim() : ''))
        .filter(Boolean)

      const cleanTargetAudience = (courseData.course_data.target_audience || [])
        .map(p => (typeof p === 'string' ? p.trim() : ''))
        .filter(Boolean)

      const dataToSend = {
        course: {
          title: courseData.course_data.title?.trim(),
          description: courseData.course_data.description?.trim(),
          place: courseData.course_data.place?.trim(),
          course_image: imageUrls.course_image,
          course_image_detail: imageUrls.course_image_detail,
          category_id: categoryId,
          status: normalizedStatus,
          objectives: cleanObjectives,
          organizers: cleanOrganizers,
          materials: cleanMaterials,
          target_audience: cleanTargetAudience
        },
        requirements: {
          start_date_registration: courseData.requirements_data.start_date_registration,
          end_date_registration: courseData.requirements_data.end_date_registration,
          start_date_course: courseData.requirements_data.start_date_course,
          end_date_course: courseData.requirements_data.end_date_course,
          days: courseData.requirements_data.days || [],
          start_time: formatTime(courseData.requirements_data.start_time),
          end_time: formatTime(courseData.requirements_data.end_time),
          location: courseData.requirements_data.location?.trim(),
          min_quota: minQuota,
          max_quota: maxQuota,
          in_person_hours: inPersonHours,
          autonomous_hours: autonomousHours,
          modality: courseData.requirements_data.modality || 'Presencial',
          certification: courseData.requirements_data.certification?.trim(),
          prerequisites: cleanPrerequisites,
          prices: cleanPrices
        },
        contents: cleanContents
      }

      if (isEdit) {
        await updateCourse(id, dataToSend)
        toast.success('¡Curso actualizado exitosamente!')
      } else {
        await createCourse(dataToSend)
        toast.success('¡Curso creado exitosamente!')
      }

      setTimeout(() => {
        navigate('/dashboard/cursos')
      }, 1200)

      return { success: true }
    } catch (error) {
      const errorMessage = error.message || 'Error al guardar el curso. Por favor, intente nuevamente.'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
      setImageUploading(false)
    }
  }

  return {
    saving,
    submitError,
    imageUploading,
    validationErrors,
    validateStep,
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
  }
}
