import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import { Subject } from "../../../backend/types";
import Sidebar from "../../../lib/components/sidebar";
import LoadingContainer from "../../../lib/components/loading_container";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";

const MateriaByTeachers = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const [items, setItems] = useState<Array<Subject>>([]);
  const [initialValues, setInitialValues] = useState<Subject>({
    id: null,
    nombre: "",
    estado: "",
    profesor: [],
  });

  const loadData = async () => {
    setLoading(true);
    const materiaId = Router.query.id as string;
    const response = await HttpClient(
      "/api/materias/" + materiaId,
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const materia = response.data;
      setItems(materia.profesor || []); // Solo asigna el array de profesores a items
      setInitialValues(materia);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "nombre",
      caption: "Nombre del profesor",
    },
    {
      dataField: "apellido",
      caption: "Apeliido del profesor",
    },
  ];

  return (
    <>
      <title>Materia</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <h2 className="text-center font-bold text-xl mt-5">
              Materia: {initialValues.nombre}
            </h2>
            <div className="px-10 mt-4">
              <LoadingContainer visible={loading} miniVersion>
                <h2 className="text-center font-bold text-xl mt-5">
                  Profesores
                </h2>
                <TreeTable
                  dataSource={items}
                  columns={columns}
                  searchPanel={true}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={10}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} profesores)`
                  }
                />
              </LoadingContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MateriaByTeachers;
