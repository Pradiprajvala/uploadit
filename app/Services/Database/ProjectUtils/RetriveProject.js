import {
  ObjectId,
  ProjectsCollection,
  UsersCollection,
} from "../MongoServices";

async function RetriveProjectByID({ projectID = "65e9b8daf8ed3110f2cc6952" }) {
  try {
    const foundProject = await ProjectsCollection.findOne({
      _id: new ObjectId(projectID),
    });
    if (!foundProject) {
      return {
        error: true,
        status: 404,
        message: "Project Not Found",
      };
    }
    return {
      error: false,
      status: 200,
      project: foundProject,
    };
  } catch (error) {
    return {
      error: true,
      status: 701,
      message: "Something went wrong",
    };
  }
}

async function RetriveProjectsOfUser({ userID }) {
  try {
    const foundUser = await UsersCollection.findOne({
      _id: new ObjectId(userID),
    });
    if (!foundUser) {
      return {
        error: true,
        status: 404,
        message: "User Not Found",
      };
    }
    console.log(foundUser);
    const projectIDs = foundUser.projects || [];
    console.log(projectIDs);
    const projects = await ProjectsCollection.find({
      _id: {
        $in: projectIDs,
      },
    }).toArray();
    console.log(projects);
    return {
      error: false,
      status: 200,
      projects: projects,
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

export { RetriveProjectByID, RetriveProjectsOfUser };
