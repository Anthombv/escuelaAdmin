import { NextApiRequest, NextApiResponse } from "next";
import { Course } from "../../types";
import { CourseSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cursos = await CourseSModel.find({});

  return res.status(200).json({
    message: "todos los cursos",
    data: cursos as Array<Course>,
    success: true,
  });
}
