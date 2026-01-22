import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import Table from "../../components/ui/Table";
import { getAllCategories } from "../../api/categories";
import { EyeIcon } from "@heroicons/react/16/solid";
import CategoryEdition from "../../components/ui/CategoryEdition";
import { updateCategory, deleteCategory } from "../../api/categories";
import { ConfirmDialog } from "../../components/ui";

const filters = {
  Estado: ["Activo", "Inactivo"],
};
const headers = ["id", "Nombre", "Estado", "Creado por", "acciones"];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  };
  const handleFilterChange = (filterColumn, value) => {
    if (filterColumn === "Estado") {
      let statusvalue = null;
      if (value === "Activo") {
        statusvalue = "activo";
      } else if (value === "Inactivo") {
        statusvalue = "inactivo";
      }
      setStatusFilter(statusvalue);
      loadCategories(1, pageSize, statusvalue);
    }
  };
  const handleEditCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      await updateCategory(selectedCategory.id, categoryData);
      setIsModalOpen(false);
      setSelectedCategory(null);
      await loadCategories();
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCategories(1, pageSize, statusFilter, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleShowEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const loadCategories = async (
    pageRequested = 1,
    pageSizeRequested = pageSize,
    status_filter = statusFilter,
    query = searchQuery,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories(
        pageRequested,
        pageSizeRequested,
        status_filter,
        query,
      );
      const categoriesArray = Array.isArray(data)
        ? data
        : data?.items || [];
      const respTotal =
        data?.total ?? (Array.isArray(data) ? data.length : 0);
      const respPageSize = data?.page_size ?? pageSizeRequested;
      const respTotalPages =
        data?.total_pages ??
        Math.max(1, Math.ceil(respTotal / respPageSize));

      const transformedCategories = categoriesArray.map((category) => ({
        id: category.id,
        Nombre: category.name,
        Estado: category.status,
        "Creado por": category.created_by,
        _original: category,
        estado: (() => {
          const s = String(category.status || "").toLowerCase();
          if (s === "activo") return "Activo";
          if (s === "inactivo") return "Inactivo";
          return s ? s[0].toUpperCase() + s.slice(1) : "";
        })(),
        acciones: (
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleShowEditModal(category);
              }}
            >
              Editar
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setSelectedCategory(category);
              }}
            >
              Eliminar
            </button>
          </div>
        ),
      }));
      setCategories(transformedCategories);
      setPage(pageRequested);
      setTotal(respTotal);
      setTotalPages(respTotalPages);
      setPageSize(respPageSize);
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
          filters={filters}
          onPageChange={(newPage) =>
            loadCategories(newPage, pageSize, statusFilter, searchQuery)
          }
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            loadCategories(1, newSize, statusFilter, searchQuery);
          }}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
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
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedCategory(null);
        }}
        onConfirm={() => {
          handleDeleteCategory(selectedCategory.id);
        }}
        title="¿Eliminar categoría?"
        message="Estás a punto de eliminar esta categoría. Esta acción no se puede deshacer. ¿Deseas continuar?"
      />
    </div>
  );
}
