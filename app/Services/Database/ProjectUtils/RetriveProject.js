import { ObjectId, ProjectsCollection } from "../MongoServices";
import { RetriveUser } from "../UserUtils/RetriveUser";

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
    // const foundUser = await UsersCollection.findOne({
    //   _id: new ObjectId(userID),
    // });
    // if (!foundUser) {
    //   return {
    //     error: true,
    //     status: 404,
    //     message: "User Not Found",
    //   };
    // }
    // const projectIDs = foundUser.projects || [];
    const projects = await ProjectsCollection.find({
      $or: [
        { ownerId: userID },
        {
          members: {
            $elemMatch: {
              $eq: userID,
            },
          },
        },
      ],
    }).toArray();
    for (let project of projects) {
      const res = await RetriveUser({ userID: project.ownerId });
      project.owner = res.user;
    }
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
