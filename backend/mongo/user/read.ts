import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";
import { UserModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const solicitude = await UserModel.findById(id, { password: 0 })

  return res.status(200).json({
    message: "un usuario",
    data: solicitude as User,
    success: true,
  });
}