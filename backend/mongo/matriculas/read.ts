import { NextApiRequest, NextApiResponse } from "next";
import { Tuition } from "../../types";
import { TiutionSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const matricula = await TiutionSModel.findById(id);

  return res.status(200).json({
    message: "una matricula",
    data: matricula as Tuition,
    success: true,
  });
}
