import React from "react";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import UsersPanel from "../lib/layouts/config/users";
import RoleLayout from "../lib/layouts/role_layout";
import Sidebar from "../lib/components/sidebar";
import MateriasPanel from "../lib/layouts/config/materias";
import CursosPanel from "../lib/layouts/config/cursos";
import ParalelosPanel from "../lib/layouts/config/paralelos";

const Configuration = () => {
  const tabPanels: Array<TabPanel> = [
    {
      name: "Usuarios",
      content: <UsersPanel />,
    },
    {
      name: "Cursos",
      content: <CursosPanel />,
    },
    {
      name: "Materias",
      content: <MateriasPanel />,
    },
    {
      name: "Paralelos",
      content: <ParalelosPanel />,
    },
  ];

  return (
    <RoleLayout permissions={[0]}>
      <title>Configuracion del sistema</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <TabContainer
                tabPanels={tabPanels}
                style={{ padding: "40px 0" }}
              />
            </div>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default Configuration;
