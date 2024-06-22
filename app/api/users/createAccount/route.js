import { UsersCollection } from "@/app/Services/Database/MongoServices";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const username = formData.get("username");
  const name = formData.get("name");
  const password = formData.get("password");
  try {
    const insertedUser = await UsersCollection.insertOne({
      name,
      password,
      username,
      projects: [],
    });
    if (!insertedUser.insertedId) {
      const error = new Error("Could Not Create User");
      error.status = 701;
      throw error;
    }
    return NextResponse.json({
      name,
      password,
      username,
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}
