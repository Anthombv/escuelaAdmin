/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "react-bootstrap";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { LoginData } from "../../../backend/types";
import HttpClient from "../../utils/http_client";
import { toast } from "react-toastify";
import LoadingContainer from "../../components/loading_container";

const currentYear = new Date().getFullYear();
// login de la app
const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // llama la funcion para iniciar sesion
  const { login } = useAuth();

  // valores del formulario
  const [initialValues, _setInitialValues] = useState<LoginData>({
    userName: "",
    password: "",
  });

  // envia los datos del formulario
  const onSubmit = async (formData: LoginData) => {
    setLoading(true);
    const response = await HttpClient("/api/login", "POST", "", -1, formData);
    if (response.success) {
      const data = response.data;
      login(data);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // maneja los datos y comportamiento del formulario
  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <title>Login</title>
      <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-600 to-indigo-300">
        <div className="container py-5">
          <div className="flex justify-center items-center m-2">
            <div className="w-full md:w-8/12 lg:w-6/12 xl:w-3/12">
              <div className="text-dark rounded-3xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
                <div className="p-5 ">
                  <div className="mb-5 mt-4 ">
                    <h2
                      className="text-center"
                      style={{
                        color: "#610d9a",
                        padding: "12px",
                        fontSize: "20px",
                      }}
                    >
                      
                    </h2>
                    <LoadingContainer visible={loading} miniVersion>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="my-4">
                          <label className="block">Nombre de Usuario</label>
                          <input
                            type="text"
                            name="userName"
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            placeholder="Ingrese su usuario"
                            className="form-control h-8 bg-gray-200 w-full rounded pl-2"
                          />
                        </div>
                        <div className="mb-5">
                          <label className="block">Contraseña</label>
                          <input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Ingrese su contraseña"
                            className="form-control h-8 bg-gray-200 w-full rounded pl-2"
                          />
                        </div>

                        <button
                          className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded font-semibold justify-center"
                          type="submit"
                        >
                          Iniciar Sesión
                        </button>
                        <footer>
                          <div className="mt-8 pt-6">
                            <p
                              style={{
                                color: "#000",
                                fontSize: "11px",
                                textAlign: "center",
                              }}
                            >
                              <strong>© Desarrollado</strong> por 
                              <strong> Jhon Zambrano</strong>
                            </p>
                          </div>
                        </footer>
                      </form>
                    </LoadingContainer>
                  </div>
                  {/* <div className="flex">
                    <div className="w-1/2">
                      <img
                        src="/logoIc.png"
                        alt=""
                        width={160}
                        className="mx-auto"
                      />
                    </div>
                    <div className="w-1/2">
                      <img
                        src="/logoIg.png"
                        alt=""
                        width={160}
                        className="mx-auto"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
