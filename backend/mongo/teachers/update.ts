import { NextApiRequest, NextApiResponse } from "next";
import { Teacher } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, TeachersModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const docente = req.body as Teacher;
  const userName = req.headers.username as string;

  const resp = await TeachersModel.findOneAndUpdate(
    {
      _id: docente.id,
    },
    docente
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito al docente: " + docente.nombre + " " + docente.apellido,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Docente no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Docente editado",
    success: true,
  });
}
