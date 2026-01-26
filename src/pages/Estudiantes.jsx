import { useEffect, useState } from "react";
import { getUsers } from "../api/users";
import { Table } from "../components/ui";
import AOS from "aos";
import "aos/dist/aos.css";

const headers = [
  "id",
  "identificación",
  "nombres",
  "apellidos",
  "celular",
  "email",
  "dirección",
  "tipo"
];

const filters = {
  tipo: ["Estudiante", "Externo", "Administrativo"],
};

export default function Estudiantes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState(null);

  const loadUsers = async (
    pageRequested = 1,
    pageSizeRequested = pageSize,
    type = typeFilter
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUsers(pageRequested, pageSizeRequested, type);

      const usersArray = response?.users || [];
      const respTotal = response?.total ?? 0;
      const respPageSize = response?.page_size ?? pageSizeRequested;
      const respTotalPages = response?.total_pages ?? Math.max(1, Math.ceil(respTotal / respPageSize));

      const transformedUsers = usersArray.map((user) => ({
        id: user.id,
        identificación: user.identification,
        nombres: [user.first_name, user.second_name].filter(Boolean).join(" "),
        apellidos: [user.first_last_name, user.second_last_name].filter(Boolean).join(" "),
        celular: user.cellphone,
        email: user.email,
        dirección: user.address || "",
        tipo: user.type
      }));

      setUsers(transformedUsers);
      setTotal(respTotal);
      setPage(pageRequested);
      setPageSize(respPageSize);
      setTotalPages(respTotalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
    AOS.refresh();
    loadUsers();
  }, []);

  const handleFilterChange = (filterColumn, value) => {
    if (filterColumn === "tipo") {
      setTypeFilter(value);
      loadUsers(1, pageSize, value);
    }
  };

  const handleReload = () => {
    loadUsers(page, pageSize, typeFilter);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Estudiantes</h1>
        <p className="text-sm text-gray-500 mt-1">Administra la información de los estudiantes y usuarios</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <Table
          headers={headers}
          data={users}
          filters={filters}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(newPage) =>
            loadUsers(newPage, pageSize, typeFilter)
          }
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            loadUsers(1, newSize, typeFilter);
          }}
          onFilterChange={handleFilterChange}
          onReload={handleReload}
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-2 px-1">{error}</div>}
    </div>
  );
}
