import { useEffect, useState } from "react";
import { useAuth } from "../../lib/hooks/use_auth";
import { ResponseData, Tuition } from "../../backend/types";
import TreeTable, { ColumnData } from "../../lib/components/tree_table";
import { toast } from "react-toastify";
import HttpClient from "../../lib/utils/http_client";
import Router from "next/router";
import Sidebar from "../../lib/components/sidebar";
import LoadingContainer from "../../lib/components/loading_container";
import TuitionModal from "../../lib/components/modals/tuitionModal";

const TuitionPage = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Tuition>>([]);
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/tuition",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const tuition: Array<any> = response.data;
      setTableData(tuition);
      console.log(tuition);
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

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingTuition != null) setEditingTuition(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "student.nombre",
      caption: "Nombre del estudiante",
    },
    {
      dataField: "course.name",
      caption: "Curso del estudiante",
    },
    {
      dataField: "parallel.name",
      caption: "Paralelo del estudiante",
    },
    {
      dataField: "period.nombre",
      caption: "Periodo de matricula",
    },
  ];

  const buttons = {
    show: (rowData: any) => {
      Router.push({
        pathname: "/tuition/show/" + (rowData.id as string),
      });
    },
    edit: (rowData: any) => {
      setEditingTuition(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/tuition/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      toast.success("Matricula cancelada");
      await loadData();
    },
  };

  return (
    <>
      <title>Matriculas</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <h2 className="text-center font-bold text-3xl">
                Gestión de Matriculas
              </h2>
              <div>
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={showModal}
                >
                  Crear nueva matricula
                </button>
              </div>
              <LoadingContainer visible={loading} miniVersion>
                <TreeTable
                  dataSource={tableData}
                  columns={columns}
                  buttons={buttons}
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
                    `Página ${actual} de ${total} (${items} Usuarios)`
                  }
                />
              </LoadingContainer>
              <TuitionModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingTuition}
                onDone={async (newTuition: Tuition) => {
                  const response: ResponseData =
                    editingTuition == null
                      ? await HttpClient(
                          "/api/tuition",
                          "POST",
                          auth.userName,
                          auth.role,
                          newTuition
                        )
                      : await HttpClient(
                          "/api/tuition",
                          "PUT",
                          auth.userName,
                          auth.role,
                          newTuition
                        );
                  if (response.success) {
                    toast.success(
                      editingTuition == null
                        ? "Matricula creada!"
                        : "Matricula actualizada!"
                    );
                    await loadData();
                  } else {
                    toast.warning(response.message);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TuitionPage;
