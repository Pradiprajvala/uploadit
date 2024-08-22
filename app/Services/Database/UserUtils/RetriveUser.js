import { ObjectId, UsersCollection } from "../MongoServices";

async function RetriveUser({ userID }) {
  try {
    let foundUser;
    if (typeof userID === "string") {
      foundUser = await UsersCollection.findOne({
        _id: new ObjectId(userID),
      });
      if (foundUser) {
        delete foundUser.password;
        delete foundUser.projects;
      }
    } else {
      // userId is an array
      console.log("User Id Array", userID);
      let userIDs = userID.map((id) => new ObjectId(id));
      foundUser = await UsersCollection.find({
        _id: {
          $in: userIDs,
        },
      }).toArray();
      if (foundUser)
        foundUser = foundUser.map((user) => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
    }
    console.log("foundUser", foundUser);
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
