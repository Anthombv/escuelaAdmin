import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import {
  ResponseData,
  Subject,
  Teacher,
} from "../../../backend/types";
import Sidebar from "../../../lib/components/sidebar";
import LoadingContainer from "../../../lib/components/loading_container";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import TeacherbySubjectModal from "../../../lib/components/modals/teacherbySubject";
import { useFormik } from "formik";

const MateriaByTeachers = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingmateriasData, setEditingmateriasData] =
    useState<Teacher | null>(null);
  const [items, setItems] = useState<Array<Teacher>>([]);
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
      setInitialValues(response.data);
      console.log(materia);
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
  const hideModal = () => setModalVisible(false);

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

  const onSubmit = async (formData: Subject) => {
    if (Router.asPath !== Router.route) {
      const materiaId = Router.query.id as string;
      setLoading(true);
      const requestData = {
        ...formData,
        profesor: items,
        id: materiaId,
      };
      const response: ResponseData = await HttpClient(
        "/api/materias",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Materia actualizada correctamente!");
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
      console.log(requestData, response, materiaId);
    }
  };

  const formik = useFormik<Subject>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  useEffect(() => {
    console.log("Items actualizados:", items);
  }, [items]);

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
              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                onClick={showModal}
              >
                Agregar profesor
              </button>
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
                <div className="mt-4">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => formik.handleSubmit()}
                  >
                    Actualizar materia
                  </button>
                </div>
              </LoadingContainer>
              <TeacherbySubjectModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingmateriasData}
                onDone={(newItem: Teacher) => {
                  if (!editingmateriasData) {
                    setItems((oldData) => [...oldData, newItem]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: Teacher) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                  }
                  console.log(newItem); // Esto debería mostrar el profesor correctamente
                  setEditingmateriasData(null);
                  hideModal(); // Asegúrate de cerrar el modal
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MateriaByTeachers;
