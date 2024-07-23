import { NextApiRequest, NextApiResponse } from "next";
import { Tuition } from "../../types";
import { TiutionSModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const matriculas = await TiutionSModel.find({});

  return res.status(200).json({
    message: "todas las matriculas",
    data: matriculas as Array<Tuition>,
    success: true,
  });
}
