import { ObjectId, UsersCollection } from "../MongoServices";

async function RetriveUser({ userID }) {
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
    return {
      error: false,
      status: 200,
      user: foundUser,
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

export { RetriveUser };
