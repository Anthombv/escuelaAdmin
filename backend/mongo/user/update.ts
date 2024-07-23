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
  const resp = await UserModel.findOneAndUpdate(
    {
      _id: user.id,
    },
    user.password !== ""
      ? user
      : {
          userName: user.userName,
          department: user.department,
          email: user.email,
          role: user.role,
          name: user.name,
          identificationCard: user.identificationCard,
          dateBirth: user.dateBirth,
          age: user.age,
          dateAdmission: user.dateAdmission,
        }
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo al Usuario:" + user.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Usuario no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Usuario editado",
    success: true,
  });
}
