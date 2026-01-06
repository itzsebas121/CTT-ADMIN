import CardCourse from "./CardCourse"
import { useEffect, useState } from "react"
import AOS from "aos"
import 'aos/dist/aos.css'
import { getCourses, getCoursesByCategory, getCoursesByHoursRange } from "../../api/courses"

export default function CoursesList({filters}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: false, mirror: true });
        AOS.refresh();
    }, []);

    // Cargar cursos desde la API
    const loadCourses = async (category = null, duration = null) => {
        try {
            setLoading(true);
            setError(null);

            let coursesData;

            // Si hay filtro de duración específico, usar el endpoint de horas
            if (duration && duration !== '') {
                const [minHours, maxHours] = getHoursRange(duration);
                coursesData = await getCoursesByHoursRange(minHours, maxHours);
            } else if (category && category !== 'Todos') {
                // Si category tiene un valor específico, filtramos por categoría
                coursesData = await getCoursesByCategory(category);
            } else {
                // Obtener todos los cursos
                coursesData = await getCourses();
            }

            // Transformar los datos de la API para que coincidan con la estructura esperada por CardCourse
            const transformedCourses = coursesData.map(course => ({
                title: course.title,
                image: course.course_image,
                isOpen: course.status === 'Activo',
                hours: course.requirements?.hours?.total?.toString() || '0',
                description: course.description,
                id: course.id,
                category: course.category
            }));

            setCourses(transformedCourses);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Convertir el filtro de duración a rango de horas
    const getHoursRange = (durationFilter) => {
        switch(durationFilter) {
            case 'less10':
                return [0, 9];
            case '10to19':
                return [10, 19];
            case '20to59':
                return [20, 59];
            case '60to99':
                return [60, 99];
            case '100plus':
                return [100, 999];
            default:
                return [0, 999];
        }
    };

    // Cargar cursos cuando cambian los filtros
    useEffect(() => {
        const categoryFilter = filters.category;
        const durationFilter = filters.duration;
        loadCourses(categoryFilter, durationFilter);
    }, [filters.category, filters.duration]);

    // Función para verificar si un curso cumple con los filtros de duración (usada para filtrado del lado del cliente)
    const matchesDurationFilter = (courseHours) => {
        if (!filters.duration) return true;

        const hours = parseInt(courseHours, 10);

        switch(filters.duration) {
            case 'less10':
                return hours >= 0 && hours <= 9;
            case '10to19':
                return hours >= 10 && hours <= 19;
            case '20to59':
                return hours >= 20 && hours <= 59;
            case '60to99':
                return hours >= 60 && hours <= 99;
            case '100plus':
                return hours >= 100;
            default:
                return true;
        }
    };

    // Función para verificar si un curso cumple con todos los filtros
    const matchesFilters = (course) => {
        // Filtro de búsqueda (por título)
        if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Filtro de categorías - Solo aplicar si NO se está usando el endpoint de horas
        // Cuando se usa el endpoint de horas, el filtrado de categoría ya se hace en el backend
        if (filters.category && filters.category !== 'Todos' && !filters.duration) {
            if (filters.category !== course.category) {
                return false;
            }
        }

        // Filtro de estado
        if (filters.status) {
            const isOpen = course.isOpen;
            if (filters.status === 'open' && !isOpen) return false;
            if (filters.status === 'closed' && isOpen) return false;
        }

        // Filtro de modalidad (si se implementa en el futuro)
        if (filters.modality) {
            const courseModality = course.requirements?.modality?.toLowerCase() || 'presencial';
            if (filters.modality !== courseModality) {
                return false;
            }
        }

        return true;
    };

    // Filtrar cursos
    const filteredCourses = courses.filter(matchesFilters);

    return (
        <div className="overflow-hidden bg-white mx-auto max-w-7xl md:px-6 lg:px-8 pt-8" data-aos="fade-down">
            <h2 className="text-2xl font-semibold text-[#6C1313] ml-6">Cursos</h2>

            {loading && (
                <div className="flex justify-center items-center mt-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C1313]"></div>
                    <span className="ml-3 text-[#6C1313]">Cargando cursos...</span>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center mt-10">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>Error al cargar los cursos: {error}</p>
                        <button
                            onClick={() => loadCourses(filters.category)}
                            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && filteredCourses.length === 0 ? (
                <div className="flex flex-col justify-center items-center mt-16 mb-12 px-6">
                    <div className="relative bg-gray-50 rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {filters.category === 'Todos' || !filters.category ? 'Sin cursos disponibles' : 'Categoría sin cursos'}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {filters.category === 'Todos' || !filters.category
                                    ? 'Actualmente no hay cursos disponibles. Te notificaremos cuando se agreguen nuevos contenidos.'
                                    : `No encontramos cursos para "${filters.category}". Prueba con otra categoría o revisa más tarde.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                !loading && !error && (
                    <div className="mt-10 lg:m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch h-auto">
                        {filteredCourses.map((course, index) => (
                            <div data-aos="zoom-in" key={course.id || index} className="inline-block w-full px-6">
                                <CardCourse
                                    title={course.title}
                                    image={course.image}
                                    isOpen={course.isOpen}
                                    hours={course.hours}
                                    id={course.id}
                                />
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}
