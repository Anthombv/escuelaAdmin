import { NextApiRequest, NextApiResponse } from "next";
import { Period } from "../../types";
import { PeriodModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paralelos = await PeriodModel.find({});

  return res.status(200).json({
    message: "todos los paralelos",
    data: paralelos as Array<Period>,
    success: true,
  });
}
