/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Sidebar from "../../../lib/components/sidebar";
import { useAuth } from "../../../lib/hooks/use_auth";
import { ResponseData, Student } from "../../../backend/types";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";

const ShowStudent = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<Student>({
    id: null,
    nombre: "",
    nombreRepresentante: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
    email: "",
    file: null,
    number: 0,
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const studentId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/students/" + studentId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      console.log(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <title>Estudiantes</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <h2 className="text-center font-bold">Ficha del estudiante</h2>

              {initialValues.file && "secure_url" in initialValues.file && (
                <img
                  src={initialValues.file.secure_url}
                  alt="Student"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              )}
              <div className="grid grid-rows-4 grid-flow-col gap-4">
                <div>
                  <p className="text-base">
                    Nombre del estudiante:{" "}
                    <strong>
                      {initialValues.nombre} {initialValues.apellido}
                    </strong>
                  </p>
                </div>
                <div>
                  Identificación del estudiante:
                  <strong> {initialValues.dni}</strong>
                </div>
                <div>
                  Email del estudiante:
                  <strong> {initialValues.email}</strong>
                </div>

                <div>
                  Fecha de nacimiento del estudiante:
                  <strong> {initialValues.fechaNacimiento}</strong>
                </div>

                <div>
                  Dirección del estudiante:
                  <strong> {initialValues.direccion}</strong>
                </div>
                <div>
                  Teléfono del estudiante:
                  <strong> {initialValues.telefono}</strong>
                </div>
                <div>
                  Género del estudiante:
                  <strong> {initialValues.genero}</strong>
                </div>
                <div>
                  Nombre del representante:
                  <strong> {initialValues.nombreRepresentante}</strong>
                </div>
              </div>
              <div>
                <h2 className="text-center font-bold">
                  Matriculas del estudiante
                </h2>
                {/* 
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
                  pageSize={2}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} Usuarios)`
                  }
                />
              </LoadingContainer> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowStudent;
