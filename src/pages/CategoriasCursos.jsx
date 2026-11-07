import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/ui/Table";
import { TablePageLayout } from "../components/layout";
import { getAllCategories, searchCategories } from "../api/categories";
import CategoryEdition from "../components/ui/CategoryEdition";
import CategoryCreation from "../components/ui/CategoryCreation";
import { deleteCategory } from "../api/categories";
import { ConfirmDialog } from "../components/ui";
import { useDashboardTheme } from "../context/DashboardThemeContext";

const filters = {
  Estado: ["Activo", "Inactivo"],
};
const headers = ["id", "Nombre", "Estado", "Creado por", "acciones"];

export default function CategoriasCursos() {
  const [rawCategories, setRawCategories] = useState([]);
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
  const { isDark } = useDashboardTheme();
  useEffect(() => {
    // loadCategories() removed to prevent double fetch since searchQuery effect triggers it
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

  const loadCategories = async (
    pageRequested = 1,
    pageSizeRequested = pageSize,
    status_filter = statusFilter,
    query = searchQuery,
  ) => {
    try {
      setLoading(true);
      setError(null);
      setLoading(true);
      setError(null);
      let data;
      if (query && query.trim().length > 0) {
        data = await searchCategories(
          query.trim(),
          pageRequested,
          pageSizeRequested,
          status_filter
        );
      } else {
        data = await getAllCategories(
          pageRequested,
          pageSizeRequested,
          status_filter
        );
      }
      const categoriesArray = Array.isArray(data)
        ? data
        : data?.items || [];
      const respTotal =
        data?.total ?? (Array.isArray(data) ? data.length : 0);
      const respPageSize = data?.page_size ?? pageSizeRequested;
      const respTotalPages =
        data?.total_pages ??
        Math.max(1, Math.ceil(respTotal / respPageSize));

      setRawCategories(categoriesArray);
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

  const categories = useMemo(() => {
    return rawCategories.map((category) => ({
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
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={() => {
              handleShowEditModal(category);
            }}
            className={`h-8 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-white/10'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border-zinc-200 shadow-xs'
            }`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDeleteConfirm(true);
              setSelectedCategory(category);
            }}
            className="h-8 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400"
          >
            Eliminar
          </button>
        </div>
      ),
    }));
  }, [rawCategories, isDark]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = async () => {
    try {
      setIsCreateModalOpen(false);
      await loadCategories();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveCategory = async () => {
    try {
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

  const handleReload = () => {
    loadCategories(page, pageSize, statusFilter, searchQuery);
  };

  return (
    <TablePageLayout
      title="Categorías"
      description="Gestiona las categorías de los cursos"
      action={
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 px-3.5 bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] text-white text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
        >
          <span className="text-base leading-none font-bold">+</span>
          <span>Crear Categoría</span>
        </button>
      }
    >
      <div className="mb-4">
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
          onReload={handleReload}
        />
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}

      {/* Modal para crear categoría */}
      <CategoryCreation
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSuccess}
      />

      {/* Modal para editar categoría */}
      <CategoryEdition
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSaveCategory}
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
    </TablePageLayout>
  );
}
