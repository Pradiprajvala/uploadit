import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/googleSetup";
import {
  RetriveProjectByID,
  RetriveProjectsOfUser,
} from "@/app/Services/Database/ProjectUtils/RetriveProject";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const projectOwnerId = formData.get("ownerId");
    const projectId = formData.get("projectId");
    if (projectOwnerId) {
      const projects = await RetriveProjectsOfUser({
        userID: projectOwnerId,
      });
      return NextResponse.json({
        ...projects,
      });
    } else {
      const projects = await RetriveProjectByID({
        projectID: projectId,
      });
      return NextResponse.json({
        ...projects,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
