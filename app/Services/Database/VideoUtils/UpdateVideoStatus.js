import { ObjectId, VideosCollection } from "../MongoServices";

async function UpdateVideoStatus({ videoId, videoStatus }) {
  try {
    const result = await VideosCollection.updateOne(
      {
        _id: new ObjectId(videoId),
      },
      {
        $set: {
          status: videoStatus,
        },
      }
    );
    return {
      error: false,
      status: 200,
      result,
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

export { UpdateVideoStatus };
