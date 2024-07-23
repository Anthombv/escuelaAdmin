import { NextApiRequest, NextApiResponse } from "next";
import { Teacher } from "../../types";
import { TeachersModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nombre = req.body.nombre as string;
  // fetch the posts
  // @ts-ignore
  const docentes = await TeachersModel.find({
    nombre: nombre,
  });

  return res.status(200).json({
    message: "Todos los docentes de " + nombre,
    data: docentes as Array<Teacher>,
    success: true,
  });
}
