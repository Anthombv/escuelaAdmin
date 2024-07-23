import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/use_auth";
import { Parallel, ResponseData } from "../../../../backend/types";
import HttpClient from "../../../utils/http_client";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import Router from "next/router";
import LoadingContainer from "../../../components/loading_container";
import MateriaModal from "../../../components/modals/materiasModa";
import ParaleloModal from "../../../components/modals/pararelosModal";

const ParalelosPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Parallel>>([]);
  const [editingParallels, setEditingParallels] = useState<Parallel | null>(
    null
  );

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/paralelos",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const paralelos: Array<any> = response.data;
      setTableData(paralelos);
      console.log(paralelos);
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
    if (editingParallels != null) setEditingParallels(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre",
    },
    {
      dataField: "limit",
      caption: "Limite",
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingParallels(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/paralelos/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <>
      <div style={{ padding: "40px 0" }}>
        <button
          className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
          onClick={showModal}
        >
          Crear paralelos
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
              `Página ${actual} de ${total} (${items} paralelos)`
            }
          />
        </LoadingContainer>

        <ParaleloModal
          visible={modalVisible}
          close={hideModal}
          initialData={editingParallels}
          onDone={async (newParalelo: Parallel) => {
            console.log(newParalelo);
            const response: ResponseData =
              editingParallels == null
                ? await HttpClient(
                    "/api/paralelos",
                    "POST",
                    auth.userName,
                    auth.role,
                    newParalelo
                  )
                : await HttpClient(
                    "/api/paralelos",
                    "PUT",
                    auth.userName,
                    auth.role,
                    newParalelo
                  );
            if (response.success) {
              toast.success(
                editingParallels == null
                  ? "Paralelo creado!"
                  : "Paralelo actualizado!"
              );
              await loadData();
            } else {
              toast.warning(response.message);
            }
          }}
        />
      </div>
    </>
  );
};

export default ParalelosPanel;
