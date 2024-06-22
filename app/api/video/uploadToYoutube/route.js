import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/googleSetup";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import streamifier from "streamifier";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (credentialsNotAvailable(session)) {
      const error = new Error("User Not Logged In");
      error.status = 501;
      throw error;
    }

    const {
      access_token,
      token_type,
      expires_at,
      scope,
      id_token,
      refresh_token,
    } = session.user.credentials;

    const formData = await request.formData();
    const video = formData.get("video");

    const oauth2Client = new google.auth.OAuth2({
      clientSecret: process.env.CLIENT_SECRET,
      clientId: process.env.CLIENT_ID,
      redirectUri: process.env.NEXT_REDIRECT_URI,
      credentials: {
        access_token: access_token,
        expiry_date: expires_at,
        scope: scope,
        id_token: id_token,
        token_type: token_type,
        refresh_token: refresh_token,
      },
    });

    const youtube_instance = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const snippet = {
      title: "Video Title",
      description: "Video Description",
      privacyStatus: "public",
    };

    const status = {
      privacyStatus: "public",
    };

    const uint8Array = new Uint8Array(await video.arrayBuffer());
    const videoReadStream = streamifier.createReadStream(uint8Array);

    const uploadedVideo = await youtube_instance.videos.insert({
      part: ["snippet", "status"],
      resource: {
        snippet,
        status,
      },
      media: {
        body: videoReadStream,
      },
    });

    return NextResponse.json({
      status: "Upload Success",
      data: uploadedVideo,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}

function credentialsNotAvailable(session) {
  if (
    !session ||
    !session.user ||
    !session.user.credentials ||
    !(
      session.user.credentials.access_token &&
      session.user.credentials.token_type &&
      session.user.credentials.expires_at &&
      session.user.credentials.scope &&
      session.user.credentials.id_token &&
      session.user.credentials.refresh_token
    )
  )
    return true;
  return false;
}
