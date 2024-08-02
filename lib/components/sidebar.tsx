import { MdOutlineSettings, MdOutlineLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiFolderPlus } from "react-icons/fi";
import { GiTeacher, GiHamburgerMenu } from "react-icons/gi";
import { RiRemoteControlFill } from "react-icons/ri";
import { useAuth } from "../hooks/use_auth";
import { useCallback } from "react";
import Router from "next/router";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { CheckPermissions } from "../utils/check_permissions";
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { BiBarChartAlt2 } from "react-icons/bi";

const Sidebar = () => {
  const { logout, auth } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    Router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:rind-white group">
          <GiHamburgerMenu
            className="block md:hidden h-6 w-6"
            aria-hidden="true"
          />
        </Disclosure.Button>
        <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:w-1/6 lg:left-0 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <p
            style={{
              color: "#610d9a",
              fontStyle: "normal",
              fontSize: "15px",
            }}
          >
            Usuario: <strong>{`${auth?.userName}`}</strong>
          </p>
          <div className="flex flex-col justify-start items-center">
            <Image
              src="/logoescuela.jpeg"
              alt="Picture of the author"
              width={170}
              height={170}
              priority={false}
            />
            <div className="my-4 border-b border-gray-100 pb-4">
              <div>
                <Link href="/">
                  <button className="w-full">
                    <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                      <IoHomeOutline className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                        Inicio
                      </h3>
                    </div>
                  </button>
                </Link>
              </div>
              {CheckPermissions(auth, [0, 1]) && (
                <div>
                  <Link href="/students/students">
                    <button className="w-full">
                      <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                        <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                          Estudiantes
                        </h3>
                      </div>
                    </button>
                  </Link>
                </div>
              )}
              {CheckPermissions(auth, [0, 1]) && (
                <div>
                  <Link href="/teachers/teachers">
                    <button className="w-full">
                      <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                        <GiTeacher className="text-2xl text-gray-600 group-hover:text-white" />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                          Docentes
                        </h3>
                      </div>
                    </button>
                  </Link>
                </div>
              )}
              {CheckPermissions(auth, [0, 1]) && (
                <div>
                  <Link href="/tuition/tuition">
                    <button className="w-full">
                      <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                        <FiFolderPlus className="text-2xl text-gray-600 group-hover:text-white" />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                          Matricula
                        </h3>
                      </div>
                    </button>
                  </Link>
                </div>
              )}
              {CheckPermissions(auth, [0, 1]) && (
                <div>
                  <Link href="/period/period">
                    <button className="w-full">
                      <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                        <BiBarChartAlt2 className="text-2xl text-gray-600 group-hover:text-white" />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                          Periodos
                        </h3>
                      </div>
                    </button>
                  </Link>
                </div>
              )}
            </div>
            {CheckPermissions(auth, [0, 1]) && (
              <div>
                <Link href="/configuration">
                  <button className="w-full">
                    <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Configuración
                      </h3>
                    </div>
                  </button>
                </Link>
              </div>
            )}
            {CheckPermissions(auth, [0]) && (
              <div>
                <Link href="/auditory">
                  <button className="w-full">
                    <div className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                      <RiRemoteControlFill className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Auditoria
                      </h3>
                    </div>
                  </button>
                </Link>
              </div>
            )}

            <div className="my-4">
              <button onClick={handleLogout}>
                <div className="flex mb-2 justify-start items-center gap-4 px-5 border border-gray-200 hover:bg-gray-900 p-2 rounded-full group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Cerrar Sesion
                  </h3>
                </div>
              </button>
            </div>
          </div>
          <footer>
            <div className="pb-8 mb-8 flex flex-col">
              <p
                style={{
                  color: "#999999",
                  fontSize: "10px",
                  textAlign: "center",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  padding: "10px 0",
                }}
              >
                <strong>© Desarrollado y Diseñado</strong> por
                <strong> Jhon Zambrano</strong>
              </p>
            </div>
          </footer>
        </div>
      </Disclosure>
    </>
  );
};

export default Sidebar;
