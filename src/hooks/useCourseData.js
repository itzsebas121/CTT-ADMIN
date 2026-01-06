import { useState, useEffect } from 'react'
import { getCourseById } from '../api/courses'

export const useCourseData = (id, isEdit) => {
  const [courseData, setCourseData] = useState({
    course_data: {
      title: '',
      description: '',
      category: 'TICS',
      status: 'Activo',
      course_image: '',
      course_image_detail: '',
      place: '',
      objectives: [''],
      organizers: [''],
      materials: [''],
      target_audience: ['']
    },
    requirements_data: {
      start_date_registration: '',
      end_date_registration: '',
      start_date_course: '',
      end_date_course: '',
      days: [],
      start_time: '',
      end_time: '',
      location: '',
      min_quota: 0,
      max_quota: 0,
      in_person_hours: 0,
      autonomous_hours: 0,
      modality: 'Presencial',
      certification: '',
      prerequisites: [''],
      prices: [{ amount: 0, category: '' }]
    },
    contents_data: [{
      unit: '',
      title: '',
      topics: [{ unit: '', title: '' }]
    }]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [originalImageUrls, setOriginalImageUrls] = useState({
    course_image: '',
    course_image_detail: ''
  })

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const loadedCourse = await getCourseById(id)
        
        const mappedCourseData = {
          course_data: {
            title: loadedCourse.title || '',
            description: loadedCourse.description || '',
            category: loadedCourse.category || 'TICS',
            status: loadedCourse.status
              ? (String(loadedCourse.status).toLowerCase() === 'activo'
                  ? 'Activo'
                  : String(loadedCourse.status).toLowerCase() === 'inactivo'
                    ? 'Cerrado'
                    : loadedCourse.status)
              : 'Activo',
            course_image: loadedCourse.course_image || '',
            course_image_detail: loadedCourse.course_image_detail || '',
            place: loadedCourse.place || '',
            objectives: loadedCourse.objectives?.length > 0 ? loadedCourse.objectives : [''],
            organizers: loadedCourse.organizers?.length > 0 ? loadedCourse.organizers : [''],
            materials: loadedCourse.materials?.length > 0 ? loadedCourse.materials : [''],
            target_audience: loadedCourse.target_audience?.length > 0 ? loadedCourse.target_audience : ['']
          },
          requirements_data: {
            start_date_registration: loadedCourse.requirements?.registration?.startDate || '',
            end_date_registration: loadedCourse.requirements?.registration?.endDate || '',
            start_date_course: loadedCourse.requirements?.courseSchedule?.startDate || '',
            end_date_course: loadedCourse.requirements?.courseSchedule?.endDate || '',
            days: loadedCourse.requirements?.courseSchedule?.days?.length > 0 ? loadedCourse.requirements.courseSchedule.days : [''],
            start_time: loadedCourse.requirements?.courseSchedule?.startTime || '',
            end_time: loadedCourse.requirements?.courseSchedule?.endTime || '',
            location: loadedCourse.requirements?.location || '',
            min_quota: loadedCourse.requirements?.quota?.min || 0,
            max_quota: loadedCourse.requirements?.quota?.max || 0,
            in_person_hours: loadedCourse.requirements?.hours?.inPerson || 0,
            autonomous_hours: loadedCourse.requirements?.hours?.autonomous || 0,
            modality: loadedCourse.requirements?.modality || '',
            certification: loadedCourse.requirements?.certification || '',
            prerequisites: loadedCourse.requirements?.prerequisites?.length > 0 ? loadedCourse.requirements.prerequisites : [''],
            prices: loadedCourse.requirements?.prices?.length > 0 ? loadedCourse.requirements.prices : [{ amount: 0, category: '' }]
          },
          contents_data: loadedCourse.contents?.length > 0 ? loadedCourse.contents : [{
            unit: '',
            title: '',
            topics: [{ unit: '', title: '' }]
          }]
        }
        
        setCourseData(mappedCourseData)
        setOriginalImageUrls({
          course_image: loadedCourse.course_image || '',
          course_image_detail: loadedCourse.course_image_detail || ''
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (isEdit) {
      loadCourse()
    } else {
      setLoading(false)
    }
  }, [id, isEdit])

  return { courseData, setCourseData, loading, error, originalImageUrls }
}
