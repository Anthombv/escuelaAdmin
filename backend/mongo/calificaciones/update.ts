import { NextApiRequest, NextApiResponse } from "next";
import { Grade } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, GradeModel,  } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const calificacion = req.body as Grade;
  const userName = req.headers.username as string;

  const resp = await GradeModel.findOneAndUpdate(
    {
      _id: calificacion.id,
    },
    calificacion
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito a la calificacion: " + calificacion.grade,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "calificacion no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "calificacion editada",
    success: true,
  });
}
