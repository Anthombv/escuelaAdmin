import { NextApiRequest, NextApiResponse } from "next";
import { Grade } from "../../types";
import { GradeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const calificaciones = await GradeModel.find({});

  return res.status(200).json({
    message: "todas las calificaciones",
    data: calificaciones as Array<Grade>,
    success: true,
  });
}
