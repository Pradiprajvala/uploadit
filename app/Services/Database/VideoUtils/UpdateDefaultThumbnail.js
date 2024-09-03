import { ObjectId, VideosCollection } from "../MongoServices";

async function UpdateVideoDefaultThumbnail({ videoId, defaultThumbnail }) {
  try {
    const result = await VideosCollection.updateOne(
      {
        _id: new ObjectId(videoId),
      },
      {
        $set: {
          defaultThumbnail,
        },
      }
    );
    return {
      error: false,
      status: 201,
      ...result,
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

export { UpdateVideoDefaultThumbnail };
