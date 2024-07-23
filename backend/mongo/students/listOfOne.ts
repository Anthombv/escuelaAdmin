import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../types";
import { StudentsModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nombre = req.body.nombre as string;
  // fetch the posts
  // @ts-ignore
  const estudiantes = await StudentsModel.find({
    nombre: nombre,
  });

  return res.status(200).json({
    message: "Todos los estudiantes de " + nombre,
    data: estudiantes as Array<Student>,
    success: true,
  });
}
