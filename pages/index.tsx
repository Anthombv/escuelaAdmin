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

interface Profesor {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  telefono: string;
  email: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

interface Subject {
  nombre: string;
  estado: string;
  profesor: Profesor[];
  _id: string;
  __v: number;
  id: string;
  horario?: string; // Añadido opcionalmente
}

interface Course {
  courseName: string;
  periodName: string;
  parallelName: string;
  students: string[];
  subjects: Subject[];
}

interface GroupedData {
  [key: string]: Course[];
}

export default function Home() {
  const { auth } = useAuth();
  const [consolidatedData, setConsolidatedData] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<IModalData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  const assignTimeSlots = (data: Course[]) => {
    const slots = [
      "Lunes 08:00 AM",
      "Martes 09:00 AM",
      "Miercoles 10:00 AM",
      "Jueves 10:30 AM",
      "Viernes 11:00 AM",
      "Martes 11:30 AM",
    ];
    data.forEach((item, index) => {
      item.subjects.forEach((subject) => {
        if (index < slots.length) {
          subject.horario = slots[index];
        }
      });
    });
    return data;
  };

  const loadData = async () => {
    const userDataString = localStorage.getItem("userData");
    let teacherEmail: string | null = null;

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
      const tuitionData: any[] = response.data;

      // Filtrar y agrupar datos
      const groupedData: { [key: string]: Course } = {};
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
            subjects: course.subjects.filter((subject: any) =>
              subject.profesor.some((prof: any) => prof.email === teacherEmail)
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
      const results: Course[] = Object.values(groupedData);

      // Asignar horarios
      const updatedData = assignTimeSlots(results);

      setConsolidatedData(updatedData);
      console.log(updatedData);
    } else {
      console.error("Error fetching data");
    }
  };

  const [filtro, setFiltro] = useState({ periodo: "", curso: "", docente: "" });
  const [reporte, setReporte] = useState([]);
  const [opciones, setOpciones] = useState({
    cursos: [],
    periodos: [],
    docentes: [],
    estudiantes: [], // Agregar esta línea
  });

  const [filtroEstudiante, setFiltroEstudiante] = useState({
    estudiante: "",
    periodo: "",
  });
  const [reporteEstudiante, setReporteEstudiante] = useState([]);

  const loadCalificaciones = async () => {
    try {
      const response = await HttpClient(
        "/api/grade",
        "GET",
        auth.userName,
        auth.role
      ); // Asegúrate de que esta URL es correcta

      // Suponiendo que los datos están dentro de una propiedad "data" u otra propiedad
      const data = response.data; // Ajusta según lo que observes en la herramienta de desarrollador

      console.log(data);
      if (!Array.isArray(data)) {
        throw new Error(
          "La data recibida no es un arreglo: " + JSON.stringify(data)
        );
      }

      setCalificaciones(data);

      const cursos = Array.from(new Set(data.map((item) => item.course.name)));
      const periodos = Array.from(
        new Set(data.map((item) => item.period.nombre))
      );
      const docentes = Array.from(
        new Set(
          data.map((item) => `${item.teacher.nombre} ${item.teacher.apellido}`)
        )
      );
      const estudiantes = Array.from(
        new Set(data.map((item) => item.student.nombre))
      );

      setOpciones({ cursos, periodos, docentes, estudiantes });
    } catch (error) {
      console.error("Error al cargar calificaciones:", error);
    }
  };

  useEffect(() => {
    loadData();
    loadCalificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filtro.periodo && filtro.curso && filtro.docente) {
      const filtradas = calificaciones.filter(
        (item) =>
          item.period.nombre === filtro.periodo &&
          item.course.name === filtro.curso &&
          `${item.teacher.nombre} ${item.teacher.apellido}` === filtro.docente
      );
      setReporte(filtradas);
    } else {
      setReporte([]);
    }
  }, [filtro, calificaciones]);

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (filtroEstudiante.estudiante && filtroEstudiante.periodo) {
      const filtradas = calificaciones.filter(
        (item) =>
          `${item.student.nombre}` === filtroEstudiante.estudiante &&
          item.period.nombre === filtroEstudiante.periodo
      );
      setReporteEstudiante(filtradas);
    } else {
      setReporteEstudiante([]);
    }
  }, [filtroEstudiante, calificaciones]);

  const handleOpenModal = (student, subject, teacher, course) => {
    console.log("course:", course);
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
        course: { name: consolidatedData[0]?.courseName },
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
        await loadData();
        await loadCalificaciones();
      } else {
        toast.error("Error al guardar la calificación: " + response.message);
      }
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
      toast.error("Error al guardar la calificación.");
    }
  };

  const handleOpenGradesModal = (studentName, term) => {
    const filteredGrades = calificaciones.filter(
      (grade) => grade.student.nombre === studentName && grade.term === term
    );
    setModalContent(filteredGrades);
    setIsModalOpen(true);
    console.log(modalContent);
  };

  const groupByPeriod = (data: Course[]): GroupedData => {
    const grouped: GroupedData = {};
    data.forEach((item) => {
      const period = item.periodName;
      if (!grouped[period]) {
        grouped[period] = [];
      }
      grouped[period].push(item);
    });
    return grouped;
  };

  const groupedData = groupByPeriod(consolidatedData);

  return (
    <>
      <title>Generaciones del futuro</title>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 p-4">
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
          {CheckPermissions(auth, [0]) && (
            <div>
              <div
                className="w-11/12 overflow-auto bg-white mx-auto block p-4"
                style={{
                  height: "700px",
                }}
              >
                <div className="p-4 ">
                  <h1 className="text-xl font-semibold mb-4">
                    Reporte de Calificaciones por curso y docente
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700">
                        Periodo Académico:
                      </label>
                      <select
                        name="periodo"
                        onChange={handleFiltroChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Seleccione un periodo</option>
                        {opciones.periodos.map((periodo) => (
                          <option key={periodo} value={periodo}>
                            {periodo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700">Curso:</label>
                      <select
                        name="curso"
                        onChange={handleFiltroChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Seleccione un curso</option>
                        {opciones.cursos.map((curso) => (
                          <option key={curso} value={curso}>
                            {curso}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700">Docente:</label>
                      <select
                        name="docente"
                        onChange={handleFiltroChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Seleccione un docente</option>
                        {opciones.docentes.map((docente) => (
                          <option key={docente} value={docente}>
                            {docente}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {reporte.length > 0 && (
                    <div className="space-y-4">
                      {reporte.map((item) => (
                        <div
                          key={item._id}
                          className="p-4 border border-gray-300 rounded shadow-sm"
                        >
                          <h2 className="text-lg font-bold">
                            {item.student.nombre}
                          </h2>
                          <p>
                            <strong>Materia:</strong> {item.subject.nombre}
                          </p>
                          <p>
                            <strong>Docente:</strong> {item.teacher.nombre}{" "}
                            {item.teacher.apellido}
                          </p>
                          <p>
                            <strong>Curso:</strong> {item.course.name}
                          </p>
                          <p>
                            <strong>Periodo:</strong> {item.period.nombre}
                          </p>
                          <p>
                            <strong>Calificación:</strong> {item.grade}
                          </p>
                          <p>
                            <strong>Bimestre:</strong> {item.term}
                          </p>
                          <p>
                            <strong>Descripción:</strong> {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <h1 className="text-xl font-semibold mb-4">
                    Reporte de academico por estudiante
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700">Estudiante:</label>
                      <select
                        name="estudiante"
                        onChange={(e) =>
                          setFiltroEstudiante({
                            ...filtroEstudiante,
                            estudiante: e.target.value,
                          })
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Seleccione un estudiante</option>
                        {opciones.estudiantes.map((estudiante) => (
                          <option key={estudiante} value={estudiante}>
                            {estudiante}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700">Periodo:</label>
                      <select
                        name="periodo"
                        onChange={(e) =>
                          setFiltroEstudiante({
                            ...filtroEstudiante,
                            periodo: e.target.value,
                          })
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Seleccione un periodo</option>
                        {opciones.periodos.map((periodo) => (
                          <option key={periodo} value={periodo}>
                            {periodo}
                          </option>
                        ))}
                      </select>
                    </div>
                    {reporteEstudiante.length > 0 && (
                      <div className="space-y-4">
                        {reporteEstudiante.map((item) => (
                          <div
                            key={item._id}
                            className="p-4 border border-gray-300 rounded shadow-sm"
                          >
                            <h2 className="text-lg font-bold">
                              Materia: {item.subject.nombre}
                            </h2>
                            <p>
                              <strong>Docente:</strong> {item.teacher.nombre}{" "}
                              {item.teacher.apellido}
                            </p>
                            <p>
                              <strong>Calificación:</strong> {item.grade}
                            </p>
                            <p>
                              <strong>Bimestre:</strong> {item.term}
                            </p>
                            <p>
                              <strong>Descripción:</strong> {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div></div>
                </div>
              </div>
            </div>
          )}
          {CheckPermissions(auth, [2]) && (
            <div>
              <div className="w-11/12 bg-white mx-auto block p-4">
                {Object.entries(groupedData).map(
                  ([periodName, courses], index) => (
                    <div key={index}>
                      <h2 className="text-center text-2xl my-3 font-bold">
                        {periodName}
                      </h2>
                      <div>
                        <h3 className="text-xl font-semibold">
                          Listado de cursos
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {courses.map((course, idx) => (
                          <div
                            className="rounded overflow-hidden shadow-lg my-4 p-2 bg-slate-100"
                            key={idx}
                          >
                            <h2 className="text-center font-semibold mb-2">
                              {course.courseName} - Paralelo{" "}
                              {course.parallelName}
                            </h2>
                            {course.subjects.map((subject, subIdx) => (
                              <div key={subIdx}>
                                <div className="flex justify-between">
                                  <p className="mb-2">
                                    <span className="font-semibold">
                                      Materia:
                                    </span>{" "}
                                    {subject.nombre}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Horario:
                                    </span>{" "}
                                    {subject.horario}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2">
                                  <h3 className="mb-2 font-semibold">
                                    Estudiantes Matriculados:
                                  </h3>
                                  <h2>Calificaciones</h2>
                                </div>
                                <ul className="list-disc list-inside mb-2">
                                  {course.students.map(
                                    (student, studentIdx) => (
                                      <li
                                        key={studentIdx}
                                        className="grid grid-cols-4 gap-4 py-2"
                                      >
                                        {student}
                                        <button
                                          onClick={() =>
                                            handleOpenGradesModal(
                                              student,
                                              "Primer Bimestre"
                                            )
                                          }
                                          className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          1er Bimestre
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleOpenGradesModal(
                                              student,
                                              "Segundo Bimestre"
                                            )
                                          }
                                          className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          2do Bimestre
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleOpenModal(
                                              course,
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
                                    )
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && modalData && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal2"
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

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="modal-content">
                <h3 className="text-2xl leading-6 font-medium text-gray-900">
                  Calificaciones {modalContent[0]?.term}
                </h3>
                <ul>
                  {modalContent.map((grade, index) => (
                    <>
                      <li key={index} className="text-xl p-4 grid">
                        <p>Materia: {grade.subject.nombre}</p>
                        <p>Calificación: {grade.grade}</p>
                        <p>Descripción: {grade.description}</p>
                      </li>
                    </>
                  ))}
                </ul>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
