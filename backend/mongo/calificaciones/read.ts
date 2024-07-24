import { NextApiRequest, NextApiResponse } from "next";
import { Grade } from "../../types";
import { GradeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const calificacion = await GradeModel.findById(id);

  return res.status(200).json({
    message: "una calificacion",
    data: calificacion as Grade,
    success: true,
  });
}
