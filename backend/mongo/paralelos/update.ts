import { NextApiRequest, NextApiResponse } from "next";
import { Parallel } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, ParallelModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paralelo = req.body as Parallel;
  const userName = req.headers.username as string;

  const resp = await ParallelModel.findOneAndUpdate(
    {
      _id: paralelo.id,
    },
    paralelo
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito al paralelo: " + paralelo.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "paralelo no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "paralelo editado",
    success: true,
  });
}
