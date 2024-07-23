import { NextApiRequest, NextApiResponse } from "next";
import { Tuition } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, TiutionSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const matricula = req.body as Tuition;
  const userName = req.headers.username as string;

  const resp = await TiutionSModel.findOneAndUpdate(
    {
      _id: matricula.id,
    },
    matricula
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito a la matricula: " + matricula.student[0].nombre,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "matricula no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "matricula editada",
    success: true,
  });
}
