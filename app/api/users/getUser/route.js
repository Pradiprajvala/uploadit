import { RetriveUser } from "@/app/Services/Database/UserUtils/RetriveUser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const user = await RetriveUser({
      userID: userId,
    });
    return NextResponse.json({
      ...user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
