import { NextApiRequest, NextApiResponse } from "next";
import { Teacher } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, BackupTeachersModel, TeachersModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const teachers = req.body as Teacher;
  console.log(teachers);
  const userName = req.headers.username as string;
  const count: number = await BackupTeachersModel.countDocuments();

  // fetch the posts
  const teac = new TeachersModel({ ...teachers, number: count + 1 });

  await teac.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Docente: " + teachers.nombre,
  });
  await auditory.save();

  const backup = new BackupTeachersModel({ teachers: teac._id });

  await backup.save();

  return res.status(200).json({
    message: "Docente creado",
    success: true,
  });
}
