import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupStudentsModel, StudentsModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const student = req.body as Student;
  const userName = req.headers.username as string;
  const count: number = await BackupStudentsModel.countDocuments();

  // fetch the posts
  const soli = new StudentsModel({ ...student, number: count + 1 });

  await soli.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Estudiante: " + student.nombre,
  });
  await auditory.save();

  const backup = new BackupStudentsModel({ student: soli._id });

  await backup.save();

  return res.status(200).json({
    message: "Estudiante creado",
    success: true,
  });
}
