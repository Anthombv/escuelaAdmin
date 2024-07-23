import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, StudentsModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const estudiante = req.body as Student;
  const userName = req.headers.username as string;

  const resp = await StudentsModel.findOneAndUpdate(
    {
      _id: estudiante.id,
    },
    estudiante
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito al estudiante: " + estudiante.nombre + " " + estudiante.apellido,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Estudiante no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Estudiante editado",
    success: true,
  });
}
