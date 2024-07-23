import { NextApiRequest, NextApiResponse } from "next";
import { Period } from "../../types";
import { PeriodModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const periodo = await PeriodModel.findById(id);

  return res.status(200).json({
    message: "un periodo",
    data: periodo as Period,
    success: true,
  });
}
