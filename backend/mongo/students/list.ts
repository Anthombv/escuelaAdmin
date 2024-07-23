import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../types";
import { StudentsModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const estudiantes = await StudentsModel.find({});

  return res.status(200).json({
    message: "todos los estudiantes",
    data: estudiantes as Array<Student>,
    success: true,
  });
}
