import { ObjectId, ProjectsCollection } from "../MongoServices";
import { RetriveUser } from "../UserUtils/RetriveUser";
import { RetriveVideos } from "../VideoUtils/RetriveVideo";

async function RetriveProjectByID({ projectID }) {
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
    const userRes = await RetriveUser({ userID: foundProject.ownerId });
    const members = await RetriveUser({ userID: foundProject.members });
    foundProject.owner = userRes.user;
    foundProject.members = members.user;
    const videosRes = await RetriveVideos(foundProject.videos);
    foundProject.videos = videosRes.videos;
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
async function RetriveMultipleProjectByID({ projectIDs }) {
  try {
    const foundProject = await ProjectsCollection.find({
      _id: {
        $in: projectIDs.map((id) => new ObjectId(id)),
      },
    }).toArray();
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
      projects: foundProject,
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

export {
  RetriveProjectByID,
  RetriveMultipleProjectByID,
  RetriveProjectsOfUser,
};
