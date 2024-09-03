import { storage } from "@/app/Services/Database/firebase";

import { ref, getDownloadURL } from "firebase/storage";

export const getVideoURL = async (path) => {
  const videoRef = ref(storage, path);
  try {
    const url = await getDownloadURL(videoRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL", error);
    return null;
  }
};
