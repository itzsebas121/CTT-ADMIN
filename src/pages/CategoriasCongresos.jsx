import { useState, useEffect, useCallback } from "react";
import { Table, ConfirmDialog } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import {
  getAllCongressCategories,
  searchCongressCategories,
  deleteCongressCategory,
} from "../api/congressCategories";
import CongressCategoryModal from "../components/congress/CongressCategoryModal";
import { toast } from "react-toastify";
import { PencilSquareIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";

const filters = {
  Estado: ["Activo", "Inactivo"],
};

const headers = ["ID", "Ícono", "Nombre", "Descripción", "Estado", "Acciones"];

export default function CategoriasCongresos() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const loadCategories = useCallback(
    async (
      pageRequested = 1,
      pageSizeRequested = pageSize,
      status_filter = statusFilter,
      query = searchQuery
    ) => {
      try {
        setLoading(true);
        setError(null);

        let data;
        let categoriesArray = [];
        let respTotal = 0;
        let respPageSize = pageSizeRequested;
        let respTotalPages = 1;

        if (query && query.trim().length > 0) {
          // Si hay búsqueda por término, usamos el endpoint de búsqueda
          const searchResult = await searchCongressCategories(query.trim());
          const allFound = Array.isArray(searchResult)
            ? searchResult
            : searchResult?.items || [];

          // Filtrado local por estado si aplica
          const filtered = status_filter
            ? allFound.filter((c) => String(c.status).toLowerCase() === status_filter.toLowerCase())
            : allFound;

          respTotal = filtered.length;
          respTotalPages = Math.max(1, Math.ceil(respTotal / pageSizeRequested));
          // Paginación local del resultado de búsqueda
          const start = (pageRequested - 1) * pageSizeRequested;
          categoriesArray = filtered.slice(start, start + pageSizeRequested);
        } else {
          // Paginación estándar del servidor
          data = await getAllCongressCategories(
            pageRequested,
            pageSizeRequested,
            status_filter,
            true
          );

          if (Array.isArray(data)) {
            categoriesArray = data;
            respTotal = data.length;
            respTotalPages = Math.max(1, Math.ceil(respTotal / pageSizeRequested));
          } else {
            categoriesArray = data?.items || data?.categories || [];
            respTotal = data?.total ?? categoriesArray.length;
            respPageSize = data?.page_size ?? pageSizeRequested;
            respTotalPages =
              data?.total_pages ?? Math.max(1, Math.ceil(respTotal / respPageSize));
          }
        }

        const transformed = categoriesArray.map((cat) => ({
          ID: cat.id,
          Ícono: (
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center p-1.5 overflow-hidden border border-gray-200">
              {cat.svgurl ? (
                <img
                  src={cat.svgurl}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <TagIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ),
          Nombre: (
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <span>{cat.name}</span>
            </div>
          ),
          Descripción: (
            <span
              className="text-gray-500 text-xs sm:text-sm max-w-xs truncate block"
              title={cat.description || "Sin descripción"}
            >
              {cat.description || "Sin descripción"}
            </span>
          ),
          Estado: (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                cat.status === "activo"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {cat.status === "activo" ? "Activo" : "Inactivo"}
            </span>
          ),
          Acciones: (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShowEditModal(cat)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar categoría"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setDeletingCategory(cat);
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar categoría"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ),
          _original: cat,
        }));

        setCategories(transformed);
        setPage(pageRequested);
        setPageSize(respPageSize);
        setTotal(respTotal);
        setTotalPages(respTotalPages);
      } catch (err) {
        setError(err.message);
        toast.error(`Error al cargar categorías: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, statusFilter, searchQuery]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCategories(1, pageSize, statusFilter, searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter]);

  const handleFilterChange = (filterColumn, value) => {
    if (filterColumn === "Estado") {
      let statusValue = null;
      if (value === "Activo") statusValue = "activo";
      if (value === "Inactivo") statusValue = "inactivo";
      setStatusFilter(statusValue);
    }
  };

  const handleShowCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleShowEditModal = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (result) => {
    toast.success(
      selectedCategory
        ? "Categoría actualizada correctamente"
        : "Categoría creada exitosamente"
    );
    loadCategories(page, pageSize, statusFilter, searchQuery);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      setLoading(true);
      await deleteCongressCategory(deletingCategory.id);
      toast.success("Categoría eliminada con éxito");
      setShowDeleteConfirm(false);
      setDeletingCategory(null);
      await loadCategories(page, pageSize, statusFilter, searchQuery);
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TablePageLayout
      title="Categorías de Congresos"
      description="Gestiona y clasifica los congresos académicos y tecnológicos por temática"
      action={
        <button
          onClick={handleShowCreateModal}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Crear Categoría
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
          onSearchChange={(val) => setSearchQuery(val)}
          onReload={() =>
            loadCategories(page, pageSize, statusFilter, searchQuery)
          }
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Modal para Crear/Editar Categoría */}
      <CongressCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleModalSuccess}
        category={selectedCategory}
      />

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        title="¿Eliminar categoría de congreso?"
        message={`Estás a punto de eliminar la categoría "${deletingCategory?.name}". Esta acción no se puede deshacer.`}
      />
    </TablePageLayout>
  );
}
