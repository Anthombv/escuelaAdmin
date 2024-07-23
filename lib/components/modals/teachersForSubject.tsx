import { useEffect, useState } from "react";
import { ModalProps, ResponseData, Subject } from "../../../backend/types";

import Router from "next/router";
import HttpClient from "../../utils/http_client";
import { useAuth } from "../../hooks/use_auth";

interface Props extends ModalProps<Subject> {
  initialData?: Subject;
}

const TeacherForSubjectModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Subject>();

  const loadData = async () => {
    // Utiliza el ID desde initialData si está disponible, de lo contrario toma de Router.query
    const materiaId = props.initialData?.id || (Router.query.id as string);
    if (materiaId) {
      const response: ResponseData = await HttpClient(
        `/api/materias/${materiaId}`,
        "GET",
        auth.userName,
        auth.role
      );
      if (response.success) {
        setInitialValues(response.data);
        console.log(response.data);
      } else {
        console.error("Error cargando la materia:", response.message);
      }
    }
  };

  useEffect(() => {
    // Carga los datos solo si no están ya proporcionados
    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialData]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 w-2/3 h-5/6 overflow-y-auto">
          <div
            style={{ color: "#94a3b8" }}
            className="text-center text-xl mb-2 font-semibold"
          >
            Materia: {initialValues?.nombre}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherForSubjectModal;
