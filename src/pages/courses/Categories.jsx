import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import  Table  from "../../components/ui/Table";
import { getAllCategories } from "../../api/categories";
import { EyeIcon } from "@heroicons/react/16/solid";

const headers = ["id", "Nombre", "Estado", "Creado por","acciones"];

export default function Categories() {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      console.log(data);
      const transformedCategories = data.items.map((category) => ({
        id: category.id,
        Nombre: category.name,
        Estado: category.status,
        "Creado por": category.created_by,
                acciones: (
          <div className="flex gap-2">
            <button onClick={() =>{ /* Lógica para ver categoría */ }}>
              <EyeIcon className="h-5 w-5 inline-block" />
            </button>
            <button
              onClick={() =>{ /* Lógica para editar categoría */ }}
            >
              Editar
            </button>
            <button
              onClick={() =>{ /* Lógica para eliminar categoría */}
              }
            >
              Eliminar
            </button>
          </div>
        )
      }));
      setCategories(transformedCategories);
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
        />
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
