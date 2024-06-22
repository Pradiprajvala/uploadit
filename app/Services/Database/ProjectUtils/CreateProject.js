import { ProjectsCollection } from "@/app/Services/Database/MongoServices";

export async function CreateProject(projectDetails) {
  const { projectName, ownerId, projectDesciption, members } = projectDetails;
  try {
    const insertedProject = await ProjectsCollection.insertOne({
      name: projectName,
      description: projectDesciption,
      ownerId: ownerId,
      createdDate: new Date(),
      videos: [],
      members: members.split(","),
    });
    if (!insertedProject.insertedId) {
      return {
        error: true,
        status: 701,
      };
    }
    const insertedProjectDocument = await ProjectsCollection.findOne({
      _id: insertedProject.insertedId,
    });
    return {
      error: false,
      project: insertedProjectDocument,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Something Went Wrong",
      status: 500,
    };
  }
}
