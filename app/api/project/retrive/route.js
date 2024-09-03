import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/googleSetup";
import {
  RetriveMultipleProjectByID,
  RetriveProjectByID,
  RetriveProjectsOfUser,
} from "@/app/Services/Database/ProjectUtils/RetriveProject";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const projectOwnerId = formData.get("ownerId");
    const projectId = formData.get("projectId");
    const projectIds = formData.get("projectIds");
    if (projectOwnerId) {
      const projects = await RetriveProjectsOfUser({
        userID: projectOwnerId,
      });
      return NextResponse.json({
        ...projects,
      });
    } else if (projectId) {
      const projects = await RetriveProjectByID({
        projectID: projectId,
      });
      return NextResponse.json({
        ...projects,
      });
    } else if (projectIds) {
      const projects = await RetriveMultipleProjectByID({
        projectIDs: projectIds.split(","),
      });
      return NextResponse.json(projects);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
