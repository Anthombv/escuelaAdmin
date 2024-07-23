import { NextApiRequest, NextApiResponse } from "next";
import { Parallel } from "../../types";
import { ParallelModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const paralelo = await ParallelModel.findById(id);

  return res.status(200).json({
    message: "un paralelo",
    data: paralelo as Parallel,
    success: true,
  });
}
