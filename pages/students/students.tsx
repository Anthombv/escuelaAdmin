import { useEffect, useState } from "react";
import { useAuth } from "../../lib/hooks/use_auth";
import { ResponseData, Student } from "../../backend/types";
import HttpClient from "../../lib/utils/http_client";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../lib/components/tree_table";
import RoleLayout from "../../lib/layouts/role_layout";
import Sidebar from "../../lib/components/sidebar";
import LoadingContainer from "../../lib/components/loading_container";
import StudentModal from "../../lib/components/modals/studentModal";
import Router from "next/router";

const Students = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Student>>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/students",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const students: Array<any> = response.data;
      setTableData(students);
      console.log(students);
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
    if (editingStudent != null) setEditingStudent(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "nombre",
      caption: "Nombres del estudiante",
    },
    {
      dataField: "apellido",
      caption: "Apellidos del estudiante",
    },
    {
      dataField: "email",
      caption: "E-mail",
    },
    {
      dataField: "dni",
      caption: "Cedula",
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
    show: (rowData: any) => {
      Router.push({
        pathname: "/students/show/" + (rowData.id as string),
      });
    },
    edit: (rowData: any) => {
      setEditingStudent(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/students/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <>
      <RoleLayout permissions={[0, 1]}>
        <title>Estudiantes</title>

        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
            <div className="w-11/12 bg-white my-14">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <h2 className="text-center font-bold text-3xl">
                  Gestión de Estudiantes
                </h2>
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={showModal}
                  >
                    Crear Estudiante
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
                <StudentModal
                  visible={modalVisible}
                  close={hideModal}
                  initialData={editingStudent}
                  onDone={async (newStudent: Student) => {
                    const response: ResponseData =
                      editingStudent == null
                        ? await HttpClient(
                            "/api/students",
                            "POST",
                            auth.userName,
                            auth.role,
                            newStudent
                          )
                        : await HttpClient(
                            "/api/students",
                            "PUT",
                            auth.userName,
                            auth.role,
                            newStudent
                          );
                    if (response.success) {
                      toast.success(
                        editingStudent == null
                          ? "Estudiante creado!"
                          : "Estudiante actualizado!"
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
      </RoleLayout>
    </>
  );
};
export default Students;
