import { RetriveNmaesOfMultipleUser } from "@/app/Services/Database/UserUtils/RetriveUser";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userIds = formData.get("userIds");
    const user = await RetriveNmaesOfMultipleUser({
      userIDs: userIds.split(","),
    });
    return NextResponse.json({
      ...user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
