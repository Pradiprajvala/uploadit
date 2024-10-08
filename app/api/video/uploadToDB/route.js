import { ref, uploadBytesResumable } from "firebase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { storage } from "@/app/Services/Database/firebase";
import { v4 as uuid } from "uuid";
import { CreateVideo } from "@/app/Services/Database/VideoUtils/CreateVideo";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (credentialsNotAvailable(session)) {
      const error = new Error("User Not Logged In");
      error.status = 401;
      throw error;
    }

    const formData = await request.formData();
    const video = formData.get("video");
    const projectId = formData.get("projectId");
    const status = formData.get("status");
    const title = formData.get("title");
    const desc = formData.get("desc");
    const defaultThumbnail = formData.get("defaultThumbnail");
    if (!video || !video.type.startsWith("video/")) {
      throw new Error("Uploaded file is not a video.");
    }
    const uint8Array = new Uint8Array(await video.arrayBuffer());
    const fileName = video.name;
    const fileExtension = fileName.split(".").pop();
    const videoPath = `Videos/${uuid()}.${fileExtension}`;

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
          reject(error);
        },
        async () => {
          try {
            const insertedVideo = await CreateVideo({
              path: upload.snapshot.ref.fullPath,
              projectId,
              title: undefined,
              status,
              title,
              desc,
              defaultThumbnail,
            });
            if (insertedVideo.error) {
              const error = new Error(" Could Not Create Video");
              error.status = insertedVideo.status;
              throw error;
            }
            resolve(
              NextResponse.json({
                message: "Success",
                video: insertedVideo.video,
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
