import { NextApiRequest, NextApiResponse } from "next";
import { Parallel } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupParalelosModel, ParallelModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paralelo = req.body as Parallel;
  const userName = req.headers.username as string;
  const count: number = await BackupParalelosModel.countDocuments();

  // fetch the posts
  const cur = new ParallelModel({ ...paralelo, number: count + 1 });

  await cur.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó paralelo: " + paralelo.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "paralelo creado",
    success: true,
  });
}
