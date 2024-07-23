import { NextApiRequest, NextApiResponse } from "next";
import { Parallel } from "../../types";
import { ParallelModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paralelos = await ParallelModel.find({});

  return res.status(200).json({
    message: "todos los paralelos",
    data: paralelos as Array<Parallel>,
    success: true,
  });
}
