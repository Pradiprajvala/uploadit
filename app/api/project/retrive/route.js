import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { RetriveProjectsOfUser } from "@/app/Services/Database/ProjectUtils/RetriveProject";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session.user);
    const projects = await RetriveProjectsOfUser({
      userID: session.user.mongoId,
    });
    return NextResponse.json({
      projects: projects,
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
