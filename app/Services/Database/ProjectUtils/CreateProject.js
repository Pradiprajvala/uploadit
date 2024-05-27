import {
  ObjectId,
  ProjectsCollection,
  UsersCollection,
} from "@/app/Services/Database/MongoServices";

export async function CreateProject(projectDetails) {
  const { projectName, ownerId } = projectDetails;
  try {
    const insertedProject = await ProjectsCollection.insertOne({
      name: projectName,
      ownerId: ownerId,
      createdDate: new Date(),
      videos: [],
      members: [],
    });
    if (!insertedProject.insertedId) {
      return {
        error: true,
        status: 701,
      };
    }
    const updateDetails = await UsersCollection.updateOne(
      { _id: new ObjectId(ownerId) },
      {
        $push: {
          projects: insertedProject.insertedId,
        },
      }
    );
    if (!updateDetails.modifiedCount) {
      return {
        error: true,
        status: 702,
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
    console.log("user col", UsersCollection);
    console.log("error1", error);
    return {
      error: true,
      message: "Something Went Wrong",
      status: 500,
    };
  }
}
