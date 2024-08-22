import { ObjectId, VideosCollection } from "../MongoServices";

async function RetriveVideos(videoIdArray) {
  try {
    const videos = await VideosCollection.find({
      _id: {
        $in: videoIdArray,
      },
    }).toArray();
    return {
      error: false,
      status: 200,
      videos,
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

async function RetriveVideoById(videoId) {
  try {
    const video = await VideosCollection.findOne({
      _id: new ObjectId(videoId),
    });
    console.log("Video 2", video, videoId);
    return {
      error: false,
      status: 200,
      video,
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

export { RetriveVideos, RetriveVideoById };
