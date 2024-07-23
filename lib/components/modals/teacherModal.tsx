import { useEffect, useState } from "react";
import { ModalProps, ResponseData, Teacher } from "../../../backend/types";
import { useAuth } from "../../hooks/use_auth";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CheckPermissions } from "../../utils/check_permissions";
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

const TeacherModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Teacher>(initialTeacher);
  const [materias, setMaterias] = useState([]);

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
      if (formData.nombre === "") {
        toast.warning("El nombre no puede estar vacio");
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
              CREAR NUEVO DOCENTE
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
                  placeholder="Nombre del docente"
                  name="nombre"
                  value={formik.values?.nombre ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Apellidos del docente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Apellidos del docente"
                  name="apellido"
                  value={formik.values?.apellido ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Fecha de nacimiento
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  name="fechaNacimiento"
                  value={formik.values?.fechaNacimiento ?? ""}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Género del docente
                </label>
                <select
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  aria-label="Default select department"
                  name="genero"
                  onChange={formik.handleChange}
                  value={formik.values?.genero ?? ""}
                >
                  <option>Seleccione una opción</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Dirección del docente
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Dirección del docente"
                      name="direccion"
                      value={formik.values?.direccion ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Teléfono del docente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Teléfono del docente"
                  name="telefono"
                  value={formik.values?.telefono ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Correo electrónico del docente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Correo electrónico del docente"
                  name="email"
                  value={formik.values?.email ?? ""}
                  onChange={formik.handleChange}
                />
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

export default TeacherModal;
