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
  const handleContentChange = (moduleIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      contents_data: prev.contents_data.map((content, i) =>
        i === moduleIndex ? { ...content, [field]: value } : content
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
      contents_data: [...prev.contents_data, { unit: '', title: '', topics: [{ unit: '', title: '' }] }]
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
          topics: [...content.topics, { unit: '', title: '' }]
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

  const validateForm = () => {
    const errors = {}
    
    // Validate General Data
    if (!courseData.course_data.title?.trim()) {
      errors.title = 'El título es requerido'
    }
    if (!courseData.course_data.description?.trim()) {
      errors.description = 'La descripción es requerida'
    }
    if (!courseData.course_data.category?.trim()) {
      errors.category = 'La categoría es requerida'
    }
    if (!courseData.course_data.place?.trim()) {
      errors.place = 'El lugar es requerido'
    }
    
    // Validate arrays are not empty and don't have empty strings
    const arrayFields = ['objectives', 'organizers', 'materials', 'target_audience']
    arrayFields.forEach(field => {
      const arr = courseData.course_data[field]
      if (!arr || arr.length === 0 || arr.every(item => !item?.trim())) {
        errors[field] = `Debe agregar al menos un ${field === 'objectives' ? 'objetivo' : field === 'organizers' ? 'organizador' : field === 'materials' ? 'material' : 'público objetivo'}`
      }
    })
    
    // Validate Requirements Data
    if (!courseData.requirements_data.start_date_registration) {
      errors.start_date_registration = 'La fecha de inicio de inscripción es requerida'
    }
    if (!courseData.requirements_data.end_date_registration) {
      errors.end_date_registration = 'La fecha de fin de inscripción es requerida'
    }
    if (!courseData.requirements_data.start_date_course) {
      errors.start_date_course = 'La fecha de inicio del curso es requerida'
    }
    if (!courseData.requirements_data.end_date_course) {
      errors.end_date_course = 'La fecha de fin del curso es requerida'
    }
    if (!courseData.requirements_data.days || courseData.requirements_data.days.length === 0 || courseData.requirements_data.days.every(d => !d?.trim())) {
      errors.days = 'Debe agregar al menos un día'
    }
    if (!courseData.requirements_data.start_time) {
      errors.start_time = 'La hora de inicio es requerida'
    }
    if (!courseData.requirements_data.end_time) {
      errors.end_time = 'La hora de fin es requerida'
    }
    if (!courseData.requirements_data.location?.trim()) {
      errors.location = 'La ubicación es requerida'
    }
    if (!courseData.requirements_data.modality?.trim()) {
      errors.modality = 'La modalidad es requerida'
    }
    if (!courseData.requirements_data.certification?.trim()) {
      errors.certification = 'La certificación es requerida'
    }
    
    // Validate quotas (must be > 1)
    if (!courseData.requirements_data.min_quota || courseData.requirements_data.min_quota < 1) {
      errors.min_quota = 'El cupo mínimo debe ser mayor a 1'
    }
    if (!courseData.requirements_data.max_quota || courseData.requirements_data.max_quota < 1) {
      errors.max_quota = 'El cupo máximo debe ser mayor a 1'
    }
    if (courseData.requirements_data.min_quota > courseData.requirements_data.max_quota) {
      errors.min_quota = 'El cupo mínimo no puede ser mayor al cupo máximo'
    }
    
    // Validate prerequisites
    if (!courseData.requirements_data.prerequisites || courseData.requirements_data.prerequisites.length === 0 || courseData.requirements_data.prerequisites.every(p => !p?.trim())) {
      errors.prerequisites = 'Debe agregar al menos un prerequisito'
    }
    
    // Validate prices
    if (!courseData.requirements_data.prices || courseData.requirements_data.prices.length === 0) {
      errors.prices = 'Debe agregar al menos un precio'
    } else {
      const invalidPrices = courseData.requirements_data.prices.some(p => !p.category?.trim())
      if (invalidPrices) {
        errors.prices = 'Todas las categorías de precio son requeridas'
      }
    }
    
    // Validate Contents
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
    
    // Validate Images
    if (!courseData.course_data.course_image) {
      errors.course_image = 'La imagen del banner es requerida'
    }
    if (!courseData.course_data.course_image_detail) {
      errors.course_image_detail = 'La imagen de detalle es requerida'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitError('Por favor, complete todos los campos requeridos correctamente.')
      toast.error('Por favor, complete todos los campos requeridos correctamente.', {
        position: "top-right",
        autoClose: 4000,
      });
      return
    }
    
    setSaving(true)
    setSubmitError(null)
    
    try {
      const imageUrls = { ...courseData.course_data }
      
      // Notificación de inicio de carga de imágenes
      if (pendingImages.course_image || pendingImages.course_image_detail) {
        toast.info('Subiendo imágenes...', {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
      for (const field of ['course_image', 'course_image_detail']) {
        if (pendingImages[field]) {
          setImageUploading(true)
          
          if (isEdit && originalImageUrls[field]) {
            try {
              await deleteImage(originalImageUrls[field])
            } catch (deleteError) {
              // Ignorar error de eliminación
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

      const dataToSend = {
        course: {
          ...imageUrls,
          status: normalizedStatus
        },
        requirements: courseData.requirements_data,
        contents: courseData.contents_data
      }

      if (isEdit) {     
        console.log('Updating course with data:', dataToSend)
        await updateCourse(id, dataToSend)
        toast.success('¡Curso actualizado exitosamente!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.log('Creating course with data:', dataToSend)
        await createCourse(dataToSend)
        toast.success('¡Curso creado exitosamente!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      setTimeout(() => {
        navigate('/dashboard/cursos')
      }, 1500);
    } catch (error) {
      const errorMessage = error.message || 'Error al guardar el curso. Por favor, intente nuevamente.'
      setSubmitError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
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
