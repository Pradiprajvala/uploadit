import { ObjectId, UsersCollection } from "../MongoServices";

async function AddProject({ userID, projectId }) {
  try {
    let result = await UsersCollection.updateOne(
      {
        _id: new ObjectId(userID),
      },
      {
        $push: {
          projects: projectId,
        },
      }
    );
    console.log("Reslut", result);
    return {
      error: false,
      status: 200,
      user: result,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: 701,
      message: "Something went wrong",
    };
  }
}

export { AddProject };
