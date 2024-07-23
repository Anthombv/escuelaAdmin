import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../types";
import { StudentsModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const estudiante = await StudentsModel.findById(id)

    return res.status(200).json({
      message: "un estudiante",
      data: estudiante as Student,
      success: true,
    });
  }