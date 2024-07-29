import { useEffect, useState } from "react";
import { useAuth } from "../../lib/hooks/use_auth";
import { Period, ResponseData } from "../../backend/types";
import HttpClient from "../../lib/utils/http_client";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../lib/components/tree_table";
import Router from "next/router";
import Sidebar from "../../lib/components/sidebar";
import LoadingContainer from "../../lib/components/loading_container";
import PeriodModal from "../../lib/components/modals/periodModal";

const PeriodPage = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<Period>>([]);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/period",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const period: Array<any> = response.data;
      setTableData(period);
      console.log(period);
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
    if (editingPeriod != null) setEditingPeriod(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "nombre",
      caption: "Nombre del periodo",
    },
    {
      dataField: "año",
      caption: "Año del periodo",
    },
    {
      dataField: "status",
      caption: "Estado del periodo",
    },
  ];

  const buttons = {
    show: (rowData: any) => {
      Router.push({
        pathname: "/period/show/" + (rowData.id as string),
      });
    },
    edit: (rowData: any) => {
      setEditingPeriod(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      console.log(rowData);
      await HttpClient(
        "/api/period/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <>
      <title>Periodos</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <h2 className="text-center font-bold text-3xl">
                Gestión de Periodos
              </h2>
              <div>
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={showModal}
                >
                  Crear nuevo periodo
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
              <PeriodModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingPeriod}
                onDone={async (newPeriod: Period) => {
                  const response: ResponseData =
                    editingPeriod == null
                      ? await HttpClient(
                          "/api/period",
                          "POST",
                          auth.userName,
                          auth.role,
                          newPeriod
                        )
                      : await HttpClient(
                          "/api/period",
                          "PUT",
                          auth.userName,
                          auth.role,
                          newPeriod
                        );
                  if (response.success) {
                    toast.success(
                      editingPeriod == null
                        ? "Periodo creado!"
                        : "Periodo actualizado!"
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

export default PeriodPage;
