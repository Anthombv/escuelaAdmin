import { NextApiRequest, NextApiResponse } from "next";
import { Subject } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, MateriasModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const materia = req.body as Subject;
  const userName = req.headers.username as string;

  const resp = await MateriasModel.findOneAndUpdate(
    {
      _id: materia.id,
    },
    materia
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la materia: " + materia.nombre,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Materia no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Materia editado",
    success: true,
  });
}
