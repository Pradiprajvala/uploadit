// pages/api/users/checkUsername.js

import { UsersCollection } from "@/app/Services/Database/MongoServices";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    // Replace with your actual database check logic
    const user = await checkUsernameInDatabase(username);
    return NextResponse.json({
      isUsernameAvailable: user ? false : true,
      _id: user?._id,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}

async function checkUsernameInDatabase(username) {
  const takenUsernames = await UsersCollection.find()
    .project({ username: 1 })
    .toArray();
  return takenUsernames.find((user) => user.username === username);
}
