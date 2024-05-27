import { ObjectId } from "../Database/MongoServices";

export const addProjectQuery = (projectName) => ({
  $push: {
    projects: {
      name: projectName || "New Project",
      _id: new ObjectId(),
    },
  },
});
