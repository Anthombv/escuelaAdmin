import { useEffect, useState } from "react";
import { ModalProps, Subject } from "../../../backend/types";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const initialSubjects: Subject = {
  id: null,
  nombre: "",
  estado: "",
  profesor: [],
};

interface Props extends ModalProps<Subject> {
  initialData?: Subject;
}

const MateriaModal = (props: Props) => {
  const [initialValues, setInitialValues] = useState<Subject>(initialSubjects);

  const handleClose = () => {
    formik.resetForm({ values: initialSubjects });
    props.close();
  };

  const formik = useFormik<Subject>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Subject) => {
      if (formData.nombre === "") {
        toast.warning("El nombre no puede estar vacio");
        return;
      }
      props.onDone(formData);

      console.log(formData)
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
              CREAR NUEVA MATERIA
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Nombre de la materia*
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Nombre de la materia"
                  name="nombre"
                  value={formik.values?.nombre ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Estado de la materia
                </label>
                <select
                  name="estado"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={formik.handleChange}
                  value={formik.values?.estado ?? ""}
                >
                  <option value="">Selecciona un tipo de cuenta</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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

export default MateriaModal;
