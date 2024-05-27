import { UsersCollection } from "@/app/Services/Database/MongoServices";

export async function getUserDetails({ name, email, imageUrl }) {
  try {
    const user = await UsersCollection.findOne({ email: email });
    if (user) {
      return { message: "User Already Present", id: user._id };
    }
    const insertUser = await UsersCollection.insertOne({
      email,
      name,
      imageUrl,
      projects: [],
    });
    return {
      message: "User Added Successfully",
      id: insertUser.insertedId,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      status: error.status || 500,
    };
  }
}
