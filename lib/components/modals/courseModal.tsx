import { useEffect, useState } from "react";
import { Course, ModalProps } from "../../../backend/types";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import HttpClient from "../../utils/http_client";
import { useAuth } from "../../hooks/use_auth";

const initialCourse: Course = {
  id: null,
  name: "",
  description: "",
  level: "",
  subjects: [],
};

interface Props extends ModalProps<Course> {
  initialData?: Course;
}

const CourseModal = (props: Props) => {
  const [initialValues, setInitialValues] = useState<Course>(initialCourse);
  const { auth } = useAuth();
  const [subjects, setSubjects] = useState([]);

  const loadData = async () => {
    const response = await HttpClient(
      "/api/materias",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const materias: Array<any> = response.data;
      setSubjects(response.data);
      console.log(materias);
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
    formik.resetForm({ values: initialCourse });
    props.close();
  };

  const formik = useFormik<Course>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: (formData: Course) => {
      props.onDone(formData);
      handleClose();
    },
  });

  useEffect(() => {
    if (props.initialData) {
      setInitialValues({
        ...props.initialData,
        subjects: props.initialData.subjects, // Asigna el array completo de materias
      });
    } else {
      setInitialValues(initialCourse);
    }
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
              CREAR NUEVO CURSO
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Nombre del curso*
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Nombre de la curso"
                  name="name"
                  value={formik.values?.name ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Descripción del curso*
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Descripción de la curso"
                  name="description"
                  value={formik.values?.description ?? ""}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Nivel del curso*
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Nivel de la curso"
                  name="level"
                  value={formik.values?.level ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Materias del curso
                </label>
                <select
                  multiple
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
                  name="subjects"
                  value={formik.values.subjects.map((sub) => sub.id)}
                  onChange={(event) => {
                    const selectedOptions = Array.from(
                      event.target.selectedOptions,
                      (option) => option.value
                    );
                    const selectedSubjects = subjects.filter((sub) =>
                      selectedOptions.includes(sub.id)
                    );
                    formik.setFieldValue("subjects", selectedSubjects);
                  }}
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.nombre}
                    </option>
                  ))}
                </select>
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

export default CourseModal;
