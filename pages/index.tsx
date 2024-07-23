/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import { CheckPermissions } from "../lib/utils/check_permissions";
import HttpClient from "../lib/utils/http_client";
import { CgKey } from "react-icons/cg";

export default function Home() {
  const { auth } = useAuth();
  const [consolidatedData, setConsolidatedData] = useState([]);

  const loadData = async () => {
    const userDataString = localStorage.getItem("userData");
    let teacherEmail = null;

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      teacherEmail = userData.email;
    }

    if (!teacherEmail) {
      console.error("No email found for the teacher in localStorage");
      return;
    }

    const response = await HttpClient(
      "/api/tuition",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const tuitionData = response.data;

      // Filtrar y agrupar datos
      const groupedData = {};
      tuitionData.forEach((tuition) => {
        const { course, period, parallel } = tuition;
        const courseId = course._id;
        const periodId = period._id;
        const parallelId = parallel._id;

        const key = `${courseId}-${periodId}-${parallelId}`;
        if (!groupedData[key]) {
          groupedData[key] = {
            courseName: course.name,
            periodName: period.nombre,
            parallelName: parallel.name,
            students: [],
            subjects: course.subjects.filter((subject) =>
              subject.profesor.some((prof) => prof.email === teacherEmail)
            ),
          };
        }
        // Agregar estudiantes si hay alguno asociado en este registro
        if (tuition.student && tuition.student.nombre) {
          groupedData[key].students.push(
            `${tuition.student.nombre.trim()} ${tuition.student.apellido.trim()}`
          );
        }
      });

      // Convertir el objeto a un array para el estado
      const results = Object.values(groupedData);
      setConsolidatedData(results);
      console.log(results);
    } else {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <title>Generaciones del futuro</title>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div
            className="mt-6 "
            style={{ display: "flex", alignItems: "center" }}
          >
            <p
              className="md:text-4xl text-xl text-center m-6"
              style={{
                display: "inline-block",
                color: "#610d9a",
                padding: "12px",
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              <strong>Unidad Educativa "Generaciones del futuro"</strong>
            </p>
          </div>
          {CheckPermissions(auth, [2]) && (
            <div>
              <div className="w-11/12 bg-white mx-auto block px-5 py-3">
                <h2 className="text-center text-2xl my-3 font-bold">
                  {consolidatedData[0]?.periodName}
                </h2>
                <div>
                  <h3 className="text-xl font-semibold">Listado de cursos</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {consolidatedData.length > 0 ? (
                    consolidatedData?.map((data, index) => (
                      <div
                        className="rounded overflow-hidden shadow-lg my-4 p-2 bg-slate-100"
                        key={index}
                      >
                        <h2 className="text-center font-semibold mb-2">
                          {data.courseName}
                        </h2>
                        <div>
                          {data.subjects.map((subject) => (
                            <>
                              <div className="flex justify-between">
                                <p className="mb-2" key={subject._id}>
                                  <span className="font-semibold">
                                    Materia:
                                  </span>{" "}
                                  {subject.nombre}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Horario:
                                  </span>{" "}
                                  
                                </p>
                              </div>
                            </>
                          ))}

                          <h3 className="mb-2 font-semibold">
                            Estudiantes Matriculados:
                          </h3>
                          <ul className="list-disc list-inside mb-2">
                            {data.students.map((student, index) => (
                              <li key={index}>{student}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>
                      No hay cursos asignados o la información del docente no
                      está disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
