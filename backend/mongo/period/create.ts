import { NextApiRequest, NextApiResponse } from "next";
import { Period } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupPeriodosModel, PeriodModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const periodo = req.body as Period;
  const userName = req.headers.username as string;
  const count: number = await BackupPeriodosModel.countDocuments();

  // fetch the posts
  const cur = new PeriodModel({ ...periodo, number: count + 1 });

  await cur.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó periodo: " + periodo.nombre,
  });
  await auditory.save();

  return res.status(200).json({
    message: "periodo creado",
    success: true,
  });
}
