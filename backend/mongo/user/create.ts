import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";
import FormatedDate from "../../../lib/utils/formated_date";
import { AuditoryModel, UserModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = req.body as User;
  const userName = req.headers.username as string;
  // fetch the posts
  const soli = new UserModel(user)

  await soli.save()

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Usuario: "+soli.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Usuario Creado",
    success: true,
  });
}