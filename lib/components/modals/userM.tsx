import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { ModalProps } from "../../../backend/types";
import theme from "../../styles/theme";

const SoliciterModal = (props: ModalProps<any>) => {
  const [dates, setDates] = useState<Array<string>>([]);
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-1/5 w-4/5 md:h-88 overflow-y-auto">
          <div
            style={{ color: theme.colors.red }}
            className="text-center text-xl mb-2 font-semibold"
          >
            Reporte General de Solicitantes{" "}
          </div>

          <label htmlFor="date-one">Fecha inicio</label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="date-one"
            type="date"
            placeholder="Fecha inicio"
            value={dates[0]}
            onChange={(e) =>
              setDates((oldValues) => [e.target.value, oldValues[1]])
            }
          />
          <label htmlFor="date-two">Fecha final</label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="date-two"
            type="date"
            placeholder="Fecha final"
            value={dates[1]}
            onChange={(e) =>
              setDates((oldValues) => [oldValues[0], e.target.value])
            }
          />
          <div>
            <button
              className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded whitespace-nowrap mt-5"
              onClick={() => {
                if (
                  dates[0] === undefined ||
                  dates[0] === "" ||
                  dates[1] === undefined ||
                  dates[1] === ""
                ) {
                  toast.warning("Debe marcar un rango de fechas");
                } else {
                  Router.push({
                    pathname: "/solicitersHistory/" + dates[0] + "¡" + dates[1],
                  });
                }
              }}
            >
              Reporte Solicitantes
            </button>
          </div>
          <div>
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded whitespace-nowrap mt-5"
              onClick={props.close}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SoliciterModal;
