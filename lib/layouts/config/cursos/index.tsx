import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { Course, ResponseData } from "../../../../backend/types";
import HttpClient from "../../../utils/http_client";
import CourseModal from "../../../components/modals/courseModal";

const CursosPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Course>>([]);
  const [editingCursos, setEditingCursos] = useState<Course | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/courses",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const cursos: Array<any> = response.data;
      setTableData(cursos);
      console.log(cursos);
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
    if (editingCursos != null) setEditingCursos(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del curso",
    },
    {
      dataField: "description",
      caption: "Descripción del curso",
    },
    {
      dataField: "level",
      caption: "Nivel del curso",
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingCursos(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/courses/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
        onClick={showModal}
      >
        Crear curso
      </button>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          dataSource={tableData}
          columns={columns}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={10}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} cursos)`
          }
        />
      </LoadingContainer>
      <CourseModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingCursos}
        onDone={async (newCuourse: Course) => {
          const response: ResponseData =
            editingCursos == null
              ? await HttpClient(
                  "/api/courses",
                  "POST",
                  auth.userName,
                  auth.role,
                  newCuourse
                )
              : await HttpClient(
                  "/api/courses",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newCuourse
                );
          if (response.success) {
            toast.success(
              editingCursos == null ? "Curso creado!" : "Curso actualizado!"
            );
            await loadData();
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </div>
  );
};

export default CursosPanel;
