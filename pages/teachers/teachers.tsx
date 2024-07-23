import { useEffect, useState } from "react";
import Sidebar from "../../lib/components/sidebar";
import { useAuth } from "../../lib/hooks/use_auth";
import HttpClient from "../../lib/utils/http_client";
import { ResponseData, Teacher } from "../../backend/types";
import { toast } from "react-toastify";
import TeacherModal from "../../lib/components/modals/teacherModal";
import Router from "next/router";
import TreeTable, { ColumnData } from "../../lib/components/tree_table";
import LoadingContainer from "../../lib/components/loading_container";

const TeachersPage = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [tableData, setTableData] = useState<Array<Teacher>>([]);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/teachers",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const teachers: Array<any> = response.data;
      setTableData(teachers);
      console.log(teachers);
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
    if (editingTeacher != null) setEditingTeacher(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "nombre",
      caption: "Nombres del docente",
    },
    {
      dataField: "apellido",
      caption: "Apellidos del docente",
    },
    {
      dataField: "email",
      caption: "E-mail",
    },
    {
      dataField: "direccion",
      caption: "Dirección",
    },
    {
      dataField: "fechaNacimiento",
      caption: "Fecha de nacimiento",
    },
    {
      dataField: "genero",
      caption: "Género",
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingTeacher(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/teachers/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <>
      <title>Docentes</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <h2 className="text-center font-bold text-3xl">
                Gestión de Docentes
              </h2>
              <div>
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={showModal}
                >
                  Crear docente
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
                    `Página ${actual} de ${total} (${items} Docentes)`
                  }
                />
              </LoadingContainer>
            </div>
          </div>
        </div>
      </div>
      <TeacherModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingTeacher}
        onDone={async (newTeacher: Teacher) => {
          console.log(newTeacher)
          const response: ResponseData =
            editingTeacher == null
              ? await HttpClient(
                  "/api/teachers",
                  "POST",
                  auth.userName,
                  auth.role,
                  newTeacher
                )
              : await HttpClient(
                  "/api/teachers",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newTeacher
                );
          if (response.success) {
            toast.success(
              editingTeacher == null
                ? "Docente creado!"
                : "Docente actualizado!"
            );
            await loadData();
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </>
  );
};

export default TeachersPage;
