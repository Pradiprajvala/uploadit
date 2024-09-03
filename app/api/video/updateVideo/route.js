import { ref, uploadBytesResumable } from "firebase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { storage } from "@/app/Services/Database/firebase";
import { UpdateVideoDefaultThumbnail } from "@/app/Services/Database/VideoUtils/UpdateDefaultThumbnail";

export async function POST(request) {
  try {
    console.log("Got request");
    const session = await getServerSession(authOptions);

    if (credentialsNotAvailable(session)) {
      const error = new Error("User Not Logged In");
      error.status = 401;
      throw error;
    }

    const formData = await request.formData();
    const video = formData.get("video");
    const videoId = formData.get("videoId");
    const videoPath = formData.get("videoPath");
    const defaultThumbnail = formData.get("defaultThumbnail");

    if (!video || !video.type.startsWith("video/")) {
      throw new Error("Uploaded file is not a video.");
    }

    const uint8Array = new Uint8Array(await video.arrayBuffer());

    console.log("Got array buffer");

    const storageRef = ref(storage, videoPath);
    const upload = uploadBytesResumable(storageRef, uint8Array);

    return new Promise((resolve, reject) => {
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Upload Percentage
        },
        (error) => {
          console.log("This is Error", error);
          reject(error);
        },
        async () => {
          try {
            const result = await UpdateVideoDefaultThumbnail({
              videoId,
              defaultThumbnail,
            });
            if (result.error) {
              const error = new Error("Could Not Create Video");
              error.status = result.status;
              throw error;
            }
            console.log(result);
            resolve(
              NextResponse.json({
                message: "Success",
                ...result,
                status: 201,
              })
            );
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}

function credentialsNotAvailable(session) {
  if (!session || !session.user || !session.user.name) return true;
  return false;
}
