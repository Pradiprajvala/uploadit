import { NextResponse } from "next/server";
import { RetriveVideoById } from "@/app/Services/Database/VideoUtils/RetriveVideo";
import { getVideoURL } from "@/app/Services/Database/VideoUtils/GetVideoUrl";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoId = formData.get("videoId");
    const { video } = await RetriveVideoById(videoId);
    const videoPath = video?.path;
    const url = await getVideoURL(videoPath);
    if (video) video.url = url;
    return NextResponse.json({
      video,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
