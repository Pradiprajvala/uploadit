import {
  ObjectId,
  ProjectsCollection,
  VideosCollection,
} from "../MongoServices";

export async function CreateVideo(videoDetails) {
  const { path, projectId, title } = videoDetails;
  try {
    const insertedVideo = await VideosCollection.insertOne({
      path,
      projectId,
      title,
    });
    if (!insertedVideo.insertedId) {
      return {
        error: true,
        status: 701,
      };
    }
    const updateDetails = await ProjectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      {
        $push: {
          videos: insertedVideo.insertedId,
        },
      }
    );
    if (!updateDetails.modifiedCount) {
      return {
        error: true,
        status: 702,
      };
    }
    const insertedVideoDocument = await VideosCollection.findOne({
      _id: insertedVideo.insertedId,
    });
    return {
      error: false,
      video: insertedVideoDocument,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: 701,
      message: "Somethnig went wrong",
    };
  }
}
