import { NextApiRequest, NextApiResponse } from "next";
import { Course } from "../../types";
import { CourseSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const curso = await CourseSModel.findById(id);

  return res.status(200).json({
    message: "un curso",
    data: curso as Course,
    success: true,
  });
}
