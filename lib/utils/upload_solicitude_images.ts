import uploadFile from "../../backend/middlewares/firebase/uploadFile";
import { CloudImage, Student } from "../../backend/types";



const checkFile = (file: File | CloudImage): boolean => {
  return (file as CloudImage)?.secure_url !== undefined ? true : false;
};

export const UploadSolicitudeImages = async (
  student: Array<Student>
): Promise<Array<Student>> => {
  for (let i = 0; i < student.length; i++) {
    if (student[i].file !== undefined) {
      if (!checkFile(student[i].file)) {
        const data = await uploadFile(student[i].file as File);
        student[i].file = {
          secure_url: data,
        };
      }
    }
  }
  return student;
};
