import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CreateProject } from "@/app/Services/Database/ProjectUtils/CreateProject";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (credentialsNotAvailable(session)) {
      const error = new Error("User Not Logged In");
      error.status = 401;
      throw error;
    }
    const formData = await request.formData();
    const projectName = formData.get("projectName");
    const insertedProject = await CreateProject({
      projectName: projectName,
      ownerId: session.user.mongoId,
    });
    if (insertedProject.error) {
      const error = new Error("Could Not Create Project");
      error.status = insertedProject.status;
      throw error;
    }
    return NextResponse.json({
      message: "Success",
      project: insertedProject.project,
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
  if (!session || !session.user || !session.user.mongoId) return true;
  return false;
}
