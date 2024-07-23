import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../backend/middlewares/mongo";
import read from "../../../backend/mongo/students/read";
import listOfOne from "../../../backend/mongo/students/listOfOne";
import remove from "../../../backend/mongo/students/delete";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // connect to the database
    await dbConnect();

    switch (req.method) {
      case "GET":
        return await read(req, res);
      case "POST":
        return await listOfOne(req, res);
      case "DELETE":
        return await remove(req, res);
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    console.error(error);
    // return the error
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}
