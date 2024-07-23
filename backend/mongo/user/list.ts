import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";
import { UserModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const solicitudes = await UserModel.find({}, { password: 0 })

  return res.status(200).json({
    message: "todas los usuarios",
    data: solicitudes as Array<User>,
    success: true,
  });
}