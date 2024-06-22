import { CreateProject } from "@/app/Services/Database/ProjectUtils/CreateProject";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const projectName = formData.get("name");
    const projectDesciption = formData.get("description");
    const projectOwnerId = formData.get("ownerId");
    const projectMembers = formData.get("members");
    if (!projectOwnerId || projectOwnerId === "") {
      const error = new Error("User Not Logged In");
      error.status = 401;
      throw error;
    }
    const insertedProject = await CreateProject({
      projectName: projectName,
      projectDesciption: projectDesciption,
      ownerId: projectOwnerId,
      members: projectMembers,
    });
    if (insertedProject.error) {
      const error = new Error("Could Not Create Project");
      error.status = insertedProject.status;
      throw error;
    }
    return NextResponse.json({
      message: "Success",
      project: insertedProject.project,
      status: 201,
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
  if (!session || !session.user || !session.user.id) return true;
  return false;
}
