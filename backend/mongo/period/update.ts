import { NextApiRequest, NextApiResponse } from "next";
import { Period } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, PeriodModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const periodo = req.body as Period;
  const userName = req.headers.username as string;

  const resp = await PeriodModel.findOneAndUpdate(
    {
      _id: periodo.id,
    },
    periodo
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito al periodo: " + periodo.nombre,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "periodo no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "periodo editado",
    success: true,
  });
}
