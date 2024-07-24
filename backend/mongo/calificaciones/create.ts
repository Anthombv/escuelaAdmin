import { NextApiRequest, NextApiResponse } from "next";
import { Grade } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupCalificacionesModel, GradeModel,  } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const calificacion = req.body as Grade;
  const userName = req.headers.username as string;
  const count: number = await BackupCalificacionesModel.countDocuments();

  // fetch the posts
  const cal = new GradeModel({ ...calificacion, number: count + 1 });

  await cal.save();

  console.log(calificacion)
  console.log(calificacion)

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó calificacion: " + calificacion.grade,
  });
  await auditory.save();

  return res.status(200).json({
    message: "calificacion creado",
    success: true,
  });
}
