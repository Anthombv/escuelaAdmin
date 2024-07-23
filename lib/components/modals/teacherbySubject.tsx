import { useEffect, useState } from "react";
import { ModalProps, Subject, Teacher } from "../../../backend/types";
import { useAuth } from "../../hooks/use_auth";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import HttpClient from "../../utils/http_client";

const initialTeacher: Teacher = {
  id: null,
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  genero: "",
  direccion: "",
  telefono: "",
  email: "",
};

interface Props extends ModalProps<Teacher> {
  initialData?: Teacher;
}
const TeacherbySubjectModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Teacher>(initialTeacher);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const loadData = async () => {
    const response = await HttpClient(
      "/api/teachers",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const teachers: Array<any> = response.data;
      setTeachers(teachers);
      console.log(teachers);
    } else {
      toast.warning(response.message);
    }
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    formik.resetForm({ values: initialTeacher });
    props.close();
  };

  const formik = useFormik<Teacher>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Teacher) => {
      props.onDone(formData);
      handleClose();
    },
  });

  const filteredTeachers =
    searchTerm.length > 0
      ? teachers.filter((teacher) =>
          `${teacher.nombre} ${teacher.apellido}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [];

  const handleSelectTeacher = (teacher) => {
    const selectedTeacherInfo = {
      ...teacher,
      id: teacher.id, // Asegurarse de que el ID se maneje correctamente
    };
    setSelectedTeacher(`${teacher.nombre} ${teacher.apellido}`);
    setSearchTerm(""); // Limpia la búsqueda
    props.onDone(selectedTeacherInfo); // Pasamos el objeto completo del profesor seleccionado
  };

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
              AGREGAR NUEVO DOCENTE
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Nombres del docente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  name="nombre"
                  placeholder="Nombre del docente"
                  value={selectedTeacher || searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm &&
                  filteredTeachers.map((teacher, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectTeacher(teacher)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {teacher.nombre} {teacher.apellido}
                    </div>
                  ))}
              </div>
            </div>
            <hr />
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

export default TeacherbySubjectModal;
