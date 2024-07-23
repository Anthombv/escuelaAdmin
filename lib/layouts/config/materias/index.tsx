import { useEffect, useState } from "react";
import { ResponseData, Subject } from "../../../../backend/types";
import { useAuth } from "../../../hooks/use_auth";
import HttpClient from "../../../utils/http_client";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import LoadingContainer from "../../../components/loading_container";
import MateriaModal from "../../../components/modals/materiasModa";
import Router from "next/router";
import TeacherForSubjectModal from "../../../components/modals/teachersForSubject";

const MateriasPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Subject>>([]);
  const [editingSubjects, setEditingSubjects] = useState<Subject | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/materias",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const users: Array<any> = response.data;
      setTableData(users);
      console.log(users);
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
    if (editingSubjects != null) setEditingSubjects(null);
    setModalVisible(false);
    await loadData();
  };

  const showModal2 = () => setModalVisible2(true);
  const hideModal2 = async () => {
    setModalVisible2(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "nombre",
      caption: "Nombre",
    },
    {
      dataField: "estado",
      caption: "Estado",
    },
  ];

  const buttons = {
    show: (rowData: any) => {
      Router.push({
        pathname: "/materias/show/" + (rowData.id as string),
      });
    },
    edit: (rowData: any) => {
      Router.push({
        pathname: "/materias/edit/" + (rowData.id as string),
      });
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/materias/" + rowData.id,
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
        Crear materia
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
            `Página ${actual} de ${total} (${items} materias)`
          }
        />
      </LoadingContainer>
      <MateriaModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingSubjects}
        onDone={async (newMaterias: Subject) => {
          const response: ResponseData =
            editingSubjects == null
              ? await HttpClient(
                  "/api/materias",
                  "POST",
                  auth.userName,
                  auth.role,
                  newMaterias
                )
              : await HttpClient(
                  "/api/materias",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newMaterias
                );
          if (response.success) {
            toast.success(
              editingSubjects == null
                ? "Materia creada!"
                : "Materia actualizada!"
            );
            await loadData();
          } else {
            toast.warning(response.message);
          }
        }}
      />
      <TeacherForSubjectModal visible={modalVisible2} close={hideModal2} />
    </div>
  );
};

export default MateriasPanel;
