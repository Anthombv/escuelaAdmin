type Props = {
  state: string;
};

export const StateField = (props: Props) => {
  let color = "white";

  switch (props.state) {
    case "Aprobado":
      color = "rgb(193 243 190)";
      //color = "#86efac";
      break;
    case "Procesando":
      color = "#aed8fb";
      break;
    case "Elaborando":
      //color = "#ffdd9e";
      //color = "#fde68a";
      color = "#fecdd3" ;
      break;
    case "Pendiente":
      color = "#ffdd9e";
      break;
    case "Abierto":
      color = "#ffdd9e";
      break;
    case "Cerrado":
      color = "rgb(193 243 190)";
      break;
    case "Rechazado":
      //color = "#b78c8a";
      color = "#fb7185";      
      break;
  }

  return (
    <p
      style={{
        backgroundColor: color,
        color: "#475569",
        //color: "#fffff",
        fontSize: "10px",
        margin: 1,
        borderRadius: "8px",
        fontWeight: "600"
      }}
    >
      {props.state.toUpperCase()}
    </p>
  );
};
