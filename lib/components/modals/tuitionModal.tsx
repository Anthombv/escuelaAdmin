import { useEffect, useState } from "react";
import {
  Course,
  ModalProps,
  Parallel,
  Period,
  Student,
  Tuition,
} from "../../../backend/types";
import { useAuth } from "../../hooks/use_auth";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import HttpClient from "../../utils/http_client";

const initialTuition: Tuition = {
  id: null,
  number: 0,
  student: null,
  period: null,
  course: null,
  parallel: null,
};

interface Props extends ModalProps<Tuition> {
  initialData?: Tuition;
}

const TuitionModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Tuition>(initialTuition);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [period, setPeriod] = useState<Period[]>([]);
  const [course, setCourse] = useState<Course[]>([]);
  const [paralelos, setParalelos] = useState<Parallel[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedParallel, setSelectedParallel] = useState<Parallel | null>(
    null
  );
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  const loadData = async () => {
    const response = await HttpClient(
      "/api/students",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const students: Student[] = response.data;
      setStudents(students);
      setFilteredStudents(students);
    } else {
      toast.warning(response.message);
    }
  };

  const loadPeriod = async () => {
    const response = await HttpClient(
      "/api/period",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const period: Period[] = response.data;
      setPeriod(period);
      console.log(period);
    } else {
      toast.warning(response.message);
    }
  };

  const loadCurses = async () => {
    const response = await HttpClient(
      "/api/courses",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const course: Course[] = response.data;
      setCourse(course);
      console.log(course);
    } else {
      toast.warning(response.message);
    }
  };

  const loadParallel = async () => {
    const response = await HttpClient(
      "/api/paralelos",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const paralelos: Parallel[] = response.data;
      setParalelos(paralelos);
      console.log(paralelos);
    } else {
      toast.warning(response.message);
    }
  };

  useEffect(() => {
    loadData();
    loadPeriod();
    loadCurses();
    loadParallel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = students.filter((student) =>
      `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    formik.setFieldValue("student", student);
  };

  const handleSelectCourse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseId = event.target.value;
    const selectedCourse = course.find((c) => c.id === selectedCourseId);
    setSelectedCourse(selectedCourse);
    formik.setFieldValue("course", selectedCourse);
  };

  const handleSelectParallel = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedParallelId = event.target.value;
    const selectedParallel = paralelos.find((p) => p.id === selectedParallelId);
    setSelectedParallel(selectedParallel);
    formik.setFieldValue("parallel", selectedParallel);
  };

  const handleSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPeriodId = event.target.value;
    const selectedPeriod = period.find((p) => p.id === selectedPeriodId);
    setSelectedPeriod(selectedPeriod);
    formik.setFieldValue("period", selectedPeriod);
  };

  const handleClose = () => {
    formik.resetForm({ values: initialTuition });
    props.close();
  };

  const formik = useFormik<Tuition>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Tuition) => {
      // Ensure student field is filled
      if (!formData.student) {
        toast.warning("Por favor, seleccione un estudiante.");
        return;
      }

      props.onDone(formData);
      handleClose();
    },
  });

  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
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
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{ color: "#94a3b8" }}
              className="text-center text-xl mb-2 font-semibold"
            >
              CREAR NUEVA MATRICULA
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Nombres del estudiante
                </label>
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  onChange={handleSearch}
                  className="border p-2 w-full"
                />
                <div className="border p-2 max-h-40 overflow-y-scroll">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {student.nombre} {student.apellido}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Curso
                </label>
                <select
                  value={formik.values.course ? formik.values.course.id : ""}
                  onChange={(e) => {
                    const selectedCourse = course.find(
                      (c) => c.id === e.target.value
                    );
                    formik.setFieldValue("course", selectedCourse);
                  }}
                  className="border p-2 w-full"
                >
                  <option value="">Seleccione un curso</option>
                  {course.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Paralelo
                </label>
                <select
                  value={
                    formik.values.parallel ? formik.values.parallel.id : ""
                  }
                  onChange={(e) => {
                    const selectedParallel = paralelos.find(
                      (p) => p.id === e.target.value
                    );
                    formik.setFieldValue("parallel", selectedParallel);
                  }}
                  className="border p-2 w-full"
                >
                  <option value="">Seleccione un paralelo</option>
                  {paralelos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Período
                </label>
                <select
                  value={formik.values.period ? formik.values.period.id : ""}
                  onChange={(e) => {
                    const selectedPeriod = period.find(
                      (p) => p.id === e.target.value
                    );
                    formik.setFieldValue("period", selectedPeriod);
                  }}
                  className="border p-2 w-full"
                >
                  <option value="">Seleccione un período</option>
                  {period.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <hr />
            {selectedStudent && (
              <div className="mb-4">
                <h3 className="text-gray-700 text-sm font-bold mb-2">
                  Datos del Estudiante
                </h3>
                <p>
                  {selectedStudent.nombre} {selectedStudent.apellido}
                </p>
                <p>{selectedStudent.dni}</p>
                <p>{selectedStudent.fechaNacimiento}</p>
                <p>{selectedStudent.genero}</p>
                <p>{selectedStudent.direccion}</p>
                <p>{selectedStudent.telefono}</p>
                <p>{selectedStudent.email}</p>
              </div>
            )}
            <div className="justify-end mt-3 grid md:grid-cols-4 grid-cols-1 gap-4">
              <div className="md:col-end-4">
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
                  type="submit"
                >
                  Guardar
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TuitionModal;
