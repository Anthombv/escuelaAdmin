import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../backend/middlewares/mongo";
import { UserModel } from "../../backend/mongo/schemas";
import { User } from "../../backend/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userName, password } = req.body;

    // connect to the database
    await dbConnect();

    if (req.method === 'POST') {
      // fetch the posts
      const user = await UserModel.findOne({ userName, password }, { password: 0 });

      if (user !== null) {
        return res.status(200).json({
          message: "Bienvenido!",
          data: user as User,
          success: true,
        });
      }

      // return the posts
      return res.status(404).json({
        message: "Verifique los datos ingresados",
        success: false,
      });
    }
    throw new Error('Invalid method')
  } catch (error) {
    // return the error
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}
