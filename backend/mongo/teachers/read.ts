import { NextApiRequest, NextApiResponse } from "next";
import { Teacher } from "../../types";
import { TeachersModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const docente = await TeachersModel.findById(id);

  return res.status(200).json({
    message: "un docente",
    data: docente as Teacher,
    success: true,
  });
}
