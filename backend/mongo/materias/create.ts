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
  // fetch the posts
  const mate = new MateriasModel(materia);

  await mate.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo una Materia: " + mate.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Usuario Creada",
    success: true,
  });
}
