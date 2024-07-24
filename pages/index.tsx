/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import { CheckPermissions } from "../lib/utils/check_permissions";
import HttpClient from "../lib/utils/http_client";
import { CgKey } from "react-icons/cg";
import { ResponseData } from "../backend/types";
import { toast } from "react-toastify";

interface IStudent {
  name: string; // Ajusta estos campos según los datos reales que tengas.
}

interface ISubject {
  nombre: string;
  profesor: ITeacher[];
}

interface ITeacher {
  nombre: string;
  apellido: string;
}

interface ICourses {
  nombre: string;
}

interface IModalData {
  student: IStudent;
  subject: ISubject;
  teacher: ITeacher;
  grade?: number;
  description?: string;
  term?: string;
}

export default function Home() {
  const { auth } = useAuth();
  const [consolidatedData, setConsolidatedData] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<IModalData | null>(null);

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

  const loadCalificaciones = async () => {
    try {
      const response = await HttpClient(
        "/api/grade",
        "GET",
        auth.userName,
        auth.role
      );
      setCalificaciones(response.data);
      console.log("Calificaciones cargadas:", response.data);
    } catch (error) {
      console.error("Error al cargar calificaciones:", error);
    }
  };

  const handleOpenModal = (student, subject, teacher) => {
    console.log("Student:", student);
    console.log("Subject:", subject);
    console.log("Teacher:", teacher);

    setModalData({
      student,
      subject,
      teacher,
      grade: 0,
      description: "",
      term: "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    loadData();
    loadCalificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student: {
          nombre: modalData.student,
          // Asegúrate de incluir todos los campos necesarios aquí
        },
        subject: {
          nombre: modalData.subject.nombre,
          // Asegúrate de incluir todos los campos necesarios aquí
        },
        teacher: {
          nombre: modalData.teacher.nombre,
          apellido: modalData.teacher.apellido,
          // Asegúrate de incluir todos los campos necesarios aquí
        },
        course: {nombre: consolidatedData[0]?.courseName},
        period: { nombre: consolidatedData[0]?.periodName }, // Si esto también debe ser un objeto, ajusta según sea necesario
        grade: modalData.grade,
        description: modalData.description,
        term: modalData.term,
      };

      console.log(payload); // Para debuggear qué estás enviando.

      const response = await HttpClient(
        "/api/grade",
        "POST",
        auth.userName,
        auth.role,
        payload
      );

      if (response.success) {
        toast.success("Calificación guardada con éxito!");
        setShowModal(false);
        setModalData(null); // Limpia los campos del formulario
      } else {
        toast.error("Error al guardar la calificación: " + response.message);
      }
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
      toast.error("Error al guardar la calificación.");
    }
  };

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
                              <div className="grid  grid-cols-2">
                                <h3 className="mb-2 font-semibold">
                                  Estudiantes Matriculados:
                                </h3>
                                <h2>Calificaciones</h2>
                              </div>
                              <ul className="list-disc list-inside mb-2">
                                {data.students.map((student, index) => (
                                  <li
                                    key={index}
                                    className="grid grid-cols-4 gap-4"
                                  >
                                    {student}

                                    <p>Primer bimestre:</p>
                                    <p>Segundo bimestre:</p>
                                    <button
                                      onClick={() =>
                                        handleOpenModal(
                                          student,
                                          subject,
                                          subject.profesor[0]
                                        )
                                      }
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                      Registrar calificación
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ))}
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
      {showModal && modalData && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Registrar Calificación
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mt-2 px-7 py-3">
                  <p></p>
                  <p>
                    <strong>Materia:</strong> {modalData.subject.nombre}
                  </p>
                  <p>
                    <strong>Profesor:</strong> {modalData.teacher.nombre}{" "}
                    {modalData.teacher.apellido}
                  </p>
                  <p>
                    <strong>Periodo:</strong> {consolidatedData[0]?.periodName}
                  </p>
                  <input
                    type="number"
                    placeholder="Calificación"
                    className="my-2 p-1 border rounded w-full"
                    value={modalData.grade || ""}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        grade: Number(e.target.value),
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    className="my-2 p-1 border rounded w-full"
                    value={modalData.description || ""}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    className="my-2 p-1 border rounded w-full"
                    value={modalData.term || ""}
                    onChange={(e) =>
                      setModalData({ ...modalData, term: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar Bimestre</option>
                    <option value="Primer Bimestre">Primer Bimestre</option>
                    <option value="Segundo Bimestre">Segundo Bimestre</option>
                  </select>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                  >
                    Guardar Calificación
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded"
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
