import { NextApiRequest, NextApiResponse } from "next";
import { Subject } from "../../types";
import { MateriasModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const materia = await MateriasModel.findById(id, { password: 0 });

  return res.status(200).json({
    message: "una materia",
    data: materia as Subject,
    success: true,
  });
}
