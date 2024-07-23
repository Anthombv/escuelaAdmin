import { NextApiRequest, NextApiResponse } from "next";
import { Course } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupCursosModel, CourseSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const curso = req.body as Course;
  const userName = req.headers.username as string;
  const count: number = await BackupCursosModel.countDocuments();

  // fetch the posts
  const cur = new CourseSModel({ ...curso, number: count + 1 });

  await cur.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Curso: " + curso.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Curso creado",
    success: true,
  });
}
