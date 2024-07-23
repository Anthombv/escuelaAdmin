import { NextApiRequest, NextApiResponse } from "next";
import { Course } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, CourseSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const curso = req.body as Course;
  const userName = req.headers.username as string;

  const resp = await CourseSModel.findOneAndUpdate(
    {
      _id: curso.id,
    },
    curso
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito al curso: " + curso.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "curso no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "curso editado",
    success: true,
  });
}
