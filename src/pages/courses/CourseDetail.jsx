import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getCourseById } from "../../api/courses";
import {
  CourseHeader,
  CourseContent,
  CourseRequirements,
  CourseSidebar,
  CourseObjectives,
  CourseMaterials,
  CourseDates
} from "../../components/courses";

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                setLoading(true);
                const courseData = await getCourseById(id);
                setCourse(courseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadCourse();
        }
    }, [id]);

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

    if (!course) {
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <button
                    onClick={() => navigate('/dashboard/cursos')}
                    className="flex items-center text-[#6C1313] hover:text-[#5a0f0f] transition-colors font-medium"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Volver
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <CourseHeader course={course} />
                        <CourseDates course={course} />
                        <CourseObjectives course={course} />
                        <CourseContent course={course} />
                        <CourseRequirements course={course} />
                        <CourseMaterials course={course} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <CourseSidebar course={course} />
                    </div>
                </div>
            </div>
        </div>
    );
}
