import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ModalProps } from "../../../backend/types";
import TabContainer, { TabPanel } from "../tab_container";

export type ImageModalProps = {
  title: string;
  image: string;
  treasuryImage: string;
};

interface Props extends ModalProps<any> {
  title: string;
  image: string;
  treasuryImage: string;
}

const ImageModal = (props: Props) => {
  const [data, setData] = useState(null);
  const modalRef = useRef(null);

  const closeModal = () => {
    props.close();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    setData(props);
  }, [props]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitante",
      content: data?.image ? (
        <Image
          src={data?.image}
          layout="responsive"
          width="100"
          height="100"
          alt=""
        />
      ) : (
        <p
          style={{
            color: "black",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20",
          }}
        >
          Sin imagen cargada
        </p>
      ),
    },
    {
      name: "Tesoreria",
      content: data?.treasuryImage ? (
        <Image
          src={data?.treasuryImage}
          layout="responsive"
          width="100"
          height="100"
          alt=""
        />
      ) : (
        <p
          style={{
            color: "black",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20",
          }}
        >
          Sin imagen cargada
        </p>
      ),
    },
  ];

  useEffect(() => {
    setData(props);
  }, [props]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={closeModal}
        ></div>

        <div
          ref={modalRef}
          className="bg-white p-6 rounded shadow-lg z-10 w-2/3 h-5/6 overflow-y-auto my-10"
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.854 4.146a.5.5 0 1 1 .708-.708L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1-.708-.708z" />
            </svg>
          </button>
          <TabContainer tabPanels={tabPanels} />
          <button
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
            onClick={closeModal}
          >
            Salir
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
