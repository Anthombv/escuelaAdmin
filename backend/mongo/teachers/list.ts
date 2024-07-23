import { NextApiRequest, NextApiResponse } from "next";
import { Teacher } from "../../types";
import { TeachersModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const docentes = await TeachersModel.find({});

  return res.status(200).json({
    message: "todos los docentes",
    data: docentes as Array<Teacher>,
    success: true,
  });
}
