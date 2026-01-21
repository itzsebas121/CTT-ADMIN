import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import  Table  from "../../components/ui/Table";
import { getAllCategories } from "../../api/categories";
import { EyeIcon } from "@heroicons/react/16/solid";
import CategoryEdition from "../../components/ui/CategoryEdition";
import { updateCategory, deleteCategory } from "../../api/categories";
import { ConfirmDialog } from "../../components/ui";

const headers = ["id", "Nombre", "Estado", "Creado por","acciones"];

export default function Categories() {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory]= useState(null)
  useEffect(() => {
    loadCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCategory(categoryId);
      setShowDeleteConfirm(false);
      await loadCategories();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleEditCategory = async (categoryData) => {
      try {
        setLoading(true);
        setError(null);
        await updateCategory(selectedCategory.id, categoryData);
        setIsModalOpen(false);
        setSelectedCategory(null)
        await loadCategories();
      } catch (error) {
        setError(error.message);
      }
  }
  const handleShowEditModal = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true);
  }
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      console.log(data);
      const page=data.page;
      const total=data.total;
      const totalPages=data.total_pages;
      const pageSize=data.page_size;
      const transformedCategories = data.items.map((category) => ({
        id: category.id,
        Nombre: category.name,
        Estado: category.status,
        "Creado por": category.created_by,
        _original: category,
                acciones: (
          <div className="flex gap-2">
            <button onClick={() =>{ /* Lógica para ver categoría */ }}>
              <EyeIcon className="h-5 w-5 inline-block" />
            </button>
            <button
              onClick={() =>{ handleShowEditModal(category)}}
            >
              Editar
            </button>
            <button
              onClick={() =>{setShowDeleteConfirm(true); setSelectedCategory(category)}}
            >
              Eliminar
            </button>
          </div>
        )
      }));
      setCategories(transformedCategories);
      setPage(page);
      setTotal(total);
      setTotalPages(totalPages);
      setPageSize(pageSize);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Categorias</h1>
        <Table
          headers={headers}
          data={categories}
          loading={loading}
          page={page}
          total={total}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
                  {/* Modal para editar categoría */}
      <CategoryEdition
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory}
      />
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {setShowDeleteConfirm(false); setSelectedCategory(null);}}
        onConfirm={() => {handleDeleteCategory(selectedCategory.id)}}
        title="¿Eliminar categoría?"
        message="Estás a punto de eliminar esta categoría. Esta acción no se puede deshacer. ¿Deseas continuar?"
      />
    </div>
  );
}
