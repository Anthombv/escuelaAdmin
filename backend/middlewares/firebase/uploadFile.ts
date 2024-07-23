import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from "./config";

const uploadFile = async (file: File): Promise<string> => {
  if (file === null) return
  const storage = getStorage(firebaseApp);

  var today: Date = new Date();
  var date: string = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();

  const storageRef = ref(storage, date + '/' + file.name);
  const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
  return await getDownloadURL(uploadTaskSnapshot.ref)
}

export default uploadFile;