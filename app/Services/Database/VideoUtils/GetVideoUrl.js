import { storage } from "@/app/Services/Database/firebase";

import { ref, getDownloadURL } from "firebase/storage";

export const getVideoURL = async (path) => {
  console.log("path", path);
  console.log("Hello", storage);
  const videoRef = ref(storage, path);
  try {
    console.log("Hello");
    const url = await getDownloadURL(videoRef);
    console.log("Url", url);
    return url;
  } catch (error) {
    console.error("Error getting download URL", error);
    return null;
  }
};
