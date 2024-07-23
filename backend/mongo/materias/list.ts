import { NextApiRequest, NextApiResponse } from "next";
import { Subject } from "../../types";
import { MateriasModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const materias = await MateriasModel.find({}, { password: 0 });

  return res.status(200).json({
    message: "todas las materias",
    data: materias as Array<Subject>,
    success: true,
  });
}
