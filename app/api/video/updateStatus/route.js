import { UpdateVideoStatus } from "@/app/Services/Database/VideoUtils/UpdateVideoStatus";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoId = formData.get("videoId");
    const videoStatus = formData.get("videoStatus");
    const response = await UpdateVideoStatus({ videoId, videoStatus });
    return NextResponse.json({
      ...response,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
