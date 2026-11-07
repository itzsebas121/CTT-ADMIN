import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  XMarkIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import TableLoading from "./loadings/TableLoading";
import Select from "./Select";
import { useDashboardTheme } from "../../context/DashboardThemeContext";

export default function Table({
  headers = [],
  data = [],
  filters = {},
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 1,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onSearchChange,
  onReload,
}) {
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const { isDark } = useDashboardTheme();

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearchChange) onSearchChange(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    if (onSearchChange) onSearchChange("");
  };

  // Manejar filtro por columna
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({ ...prev, [column]: value }));
    if (onFilterChange) {
      onFilterChange(column, value === "All" ? null : value);
    }
  };

  // Datos filtrados localmente si no es server-side
  const filteredData = useMemo(() => {
    if (onSearchChange) return data;

    return data.filter((row) => {
      const matchesSearch = !search
        ? true
        : headers.some((header) =>
            String(row[header]).toLowerCase().includes(search.toLowerCase())
          );

      const matchesFilters = headers.every((header) => {
        if (!columnFilters[header] || columnFilters[header] === "All") return true;
        return String(row[header]) === columnFilters[header];
      });

      return matchesSearch && matchesFilters;
    });
  }, [search, columnFilters, data, headers, onSearchChange]);

  const handlePrev = () => {
    if (onPageChange && page > 1) onPageChange(page - 1);
  };
  const handleNext = () => {
    if (onPageChange && page < totalPages) onPageChange(page + 1);
  };

  // Helpers de Paginación
  const startRecord = filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(page * pageSize, total);

  const formatHeaderName = (header) => {
    const map = {
      id: "ID",
      titulo: "Título",
      nombre: "Nombre",
      horas: "Duración",
      estado: "Estado",
      acciones: "Acciones",
      detalles: "Acciones",
      identificación: "Identificación",
      nombres: "Nombres",
      apellidos: "Apellidos",
      celular: "Celular",
      email: "Correo",
      dirección: "Dirección",
      tipo: "Tipo de Usuario",
      portada: "Portada",
      congreso: "Congreso",
      edición: "Edición",
      año: "Año",
      fechas: "Fechas",
      "creado por": "Creado por",
      "fecha de inscripcion": "Fecha de Inscripción",
      fecha_inscripcion: "Fecha de Inscripción",
    };
    return map[header.toLowerCase()] || header.charAt(0).toUpperCase() + header.slice(1);
  };

  const renderCellValue = (header, value) => {
    if (value === null || value === undefined) {
      return <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>—</span>;
    }
    // Si ya es un elemento React/JSX (objeto con $$typeof o propiedad type)
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      return value;
    }

    const h = header.toLowerCase();

    if (h === 'id') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
          isDark ? 'bg-zinc-800 text-zinc-300 border-white/10' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
        }`}>
          #{value}
        </span>
      );
    }

    if (h === 'estado') {
      const s = String(value).toLowerCase().trim();
      const isPositive = ['activo', 'pagado', 'facturado', 'completado', 'confirmado'].includes(s);
      const isPending = ['pendiente', 'interesado', 'generada la orden', 'en pausa'].includes(s);
      const isNegative = ['inactivo', 'cerrado', 'anulado', 'rechazado'].includes(s);

      if (isPositive) {
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap border ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {value}
          </span>
        );
      }
      if (isPending) {
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap border ${
            isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {value}
          </span>
        );
      }
      if (isNegative) {
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap border ${
            isDark ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            {value}
          </span>
        );
      }
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
          isDark ? 'bg-zinc-800 text-zinc-300 border-white/10' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
        }`}>
          {value}
        </span>
      );
    }

    if (h === 'horas') {
      return (
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${
          isDark ? 'text-zinc-300' : 'text-zinc-600'
        }`}>
          <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span>{value} horas</span>
        </div>
      );
    }

    if (h === 'titulo' || h === 'nombre') {
      return (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
          <span className={`font-semibold text-xs sm:text-sm ${
            isDark ? 'text-zinc-100' : 'text-zinc-900'
          }`}>
            {value}
          </span>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Controles Superiores: Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* Input de Búsqueda y Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <label htmlFor="dokploy-admin-search" className="sr-only">
              Buscar en la tabla
            </label>
            <div
              className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="dokploy-admin-search"
              type="search"
              placeholder="Buscar..."
              value={search}
              onChange={handleSearchChange}
              className={`w-full h-9 pl-9 pr-7 text-xs rounded-lg outline-none transition-colors border ${
                isDark
                  ? 'bg-[#16161a] border-white/[0.08] text-zinc-100 placeholder:text-zinc-500 focus:border-[#00345e] focus:ring-1 focus:ring-[#00345e]/40'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-[#00345e] focus:ring-1 focus:ring-[#00345e]/40 shadow-xs'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 border-0 bg-transparent cursor-pointer p-0.5 ${
                  isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {onReload && (
            <button
              type="button"
              onClick={onReload}
              disabled={loading}
              className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer border disabled:opacity-50 ${
                isDark
                  ? 'bg-[#16161a] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-xs'
              }`}
              title="Recargar datos"
              aria-label="Recargar datos"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin text-[#00345e]' : ''}`} />
            </button>
          )}
        </div>

        {/* Filtros dinámicos por columna */}
        <div className="flex flex-wrap items-center gap-2">
          {headers.map((header) =>
            filters[header] ? (
              <div key={header} className="w-44">
                <Select
                  value={columnFilters[header] || "All"}
                  onChange={(value) => handleFilterChange(header, value)}
                  options={[
                    { value: 'All', label: 'Todos' },
                    ...filters[header].map((opt) => ({ value: opt, label: opt })),
                  ]}
                  placeholder={`Filtrar ${formatHeaderName(header)}`}
                />
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Tabla Principal: Estilo Dokploy Card */}
      <div
        className={`w-full rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? 'bg-[#16161a] border-white/[0.08] shadow-lg'
            : 'bg-white border-black/[0.08] shadow-xs'
        }`}
      >
        <div className="overflow-x-auto min-h-[360px]">
          <table className="min-w-full text-left border-collapse" aria-label="Tabla de datos">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? 'bg-[#121215] border-white/[0.08]' : 'bg-zinc-50/80 border-black/[0.06]'
                }`}
              >
                {headers.map((header, idx) => {
                  const isActions = ['acciones', 'detalles'].includes(header.toLowerCase());
                  return (
                    <th
                      key={idx}
                      scope="col"
                      className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      } ${isActions ? 'text-right' : 'text-left'}`}
                    >
                      {formatHeaderName(header)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? 'divide-white/[0.04] bg-[#16161a]' : 'divide-black/[0.04] bg-white'
              }`}
            >
              {loading ? (
                <TableLoading rows={pageSize} cols={headers.length} />
              ) : filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50/80'
                    }`}
                  >
                    {headers.map((header, colIndex) => {
                      const isActions = ['acciones', 'detalles'].includes(header.toLowerCase());
                      return (
                        <td
                          key={colIndex}
                          className={`px-5 py-3.5 whitespace-nowrap text-xs align-middle ${
                            isDark ? 'text-zinc-300' : 'text-zinc-800'
                          } ${isActions ? 'text-right' : 'text-left'}`}
                        >
                          {renderCellValue(header, row[header])}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          isDark ? 'bg-white/[0.04] text-zinc-500' : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        <MagnifyingGlassIcon className="h-6 w-6" />
                      </div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        No se encontraron registros
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        Intenta ajustar tu búsqueda o filtros seleccionados.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Barra de Paginación Dokploy Style */}
        {total > 0 && (
          <div
            className={`px-4 sm:px-5 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark
                ? 'border-white/[0.06] bg-[#121215]/60 text-zinc-400'
                : 'border-black/[0.06] bg-zinc-50/50 text-zinc-600'
            }`}
          >
            {/* Información de Registros */}
            <div>
              Mostrando{' '}
              <strong className={isDark ? 'text-zinc-200 font-semibold' : 'text-zinc-900 font-semibold'}>
                {startRecord}
              </strong>{' '}
              a{' '}
              <strong className={isDark ? 'text-zinc-200 font-semibold' : 'text-zinc-900 font-semibold'}>
                {endRecord}
              </strong>{' '}
              de{' '}
              <strong className={isDark ? 'text-zinc-200 font-semibold' : 'text-zinc-900 font-semibold'}>
                {total}
              </strong>{' '}
              registros
            </div>

            {/* Controles de Navegación */}
            <div className="flex items-center gap-3">
              <nav aria-label="Navegación de páginas" className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={Number(page) <= 1 || loading}
                  className={`h-8 px-2.5 flex items-center gap-1 rounded-lg border disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-xs font-medium ${
                    isDark
                      ? 'border-white/10 bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 shadow-xs'
                  }`}
                  aria-label="Anterior"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <span
                  className={`px-2.5 py-1 font-medium rounded-lg text-xs border ${
                    isDark
                      ? 'text-zinc-200 bg-zinc-800 border-white/10'
                      : 'text-zinc-900 bg-white border-zinc-200 shadow-xs'
                  }`}
                  aria-current="page"
                >
                  {page} de {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={Number(page) >= Number(totalPages) || loading}
                  className={`h-8 px-2.5 flex items-center gap-1 rounded-lg border disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-xs font-medium ${
                    isDark
                      ? 'border-white/10 bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 shadow-xs'
                  }`}
                  aria-label="Siguiente"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </nav>

              <div
                className={`inline-flex items-center gap-1.5 pl-3 border-l ${
                  isDark ? 'border-white/[0.08] text-zinc-400' : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <span>Filas:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                  className={`h-8 px-2 font-medium rounded-lg cursor-pointer outline-none text-xs border ${
                    isDark
                      ? 'text-zinc-200 bg-zinc-800 border-white/10'
                      : 'text-zinc-800 bg-white border-zinc-200 shadow-xs'
                  }`}
                  aria-label="Número de filas por página"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
