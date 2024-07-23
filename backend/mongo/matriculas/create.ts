import { NextApiRequest, NextApiResponse } from "next";
import { Tuition } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import {
  AuditoryModel,
  BackupMatriculasModel,
  MateriasModel,
  TiutionSModel,
} from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const matricula = req.body as Tuition;
  const userName = req.headers.username as string;
  const count: number = await BackupMatriculasModel.countDocuments();

  // fetch the posts
  const cur = new TiutionSModel({ ...matricula, number: count + 1 });

  await cur.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó matricula: " + matricula.student.nombre,
  });
  await auditory.save();

  return res.status(200).json({
    message: "matricula creada",
    success: true,
  });
}
