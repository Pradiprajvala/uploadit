import { UsersCollection } from "@/app/Services/Database/MongoServices";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    const foundUser = await UsersCollection.findOne({
      username,
    });
    if (!foundUser || foundUser.password === password) {
      const error = new Error("Invalid Credentials");
      error.status = 401;
      throw error;
    }
    return NextResponse.json({
      user: foundUser,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}
