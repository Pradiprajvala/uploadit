import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/googleSetup";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getBytes, getStream, ref } from "firebase/storage";
import { storage } from "@/app/Services/Database/firebase";
import streamifier from "streamifier";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (credentialsNotAvailable(session)) {
      const error = new Error("User Not Logged In");
      error.status = 501;
      throw error;
    }

    const formData = await request.formData();
    const code = formData.get("code");
    const expires_at = formData.get("expires_at");
    const videoPath = formData.get("videoPath");
    const title = formData.get("title");
    const description = formData.get("description");
    const credentials = await exchangeCodeForTokens(code);
    const { access_token, token_type, scope, id_token, refresh_token } =
      credentials;

    const oauth2Client = new google.auth.OAuth2({
      clientSecret: process.env.CLIENT_SECRET,
      clientId: process.env.CLIENT_ID,
      redirectUri: "postmessage",
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
      title,
      description,
      privacyStatus: "public",
    };

    const status = {
      privacyStatus: "public",
    };

    const videoRef = ref(storage, videoPath);
    const uint8Array = new Uint8Array(await getBytes(videoRef));
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
  if (!session || !session.user || !session.user.name) return true;
  return false;
}

const exchangeCodeForTokens = async (authorizationCode) => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: authorizationCode,
      client_id:
        "192238680972-77n8uc47jf2f810kv5vokk4a2tond0rs.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    }),
  });
  const data = await response.json();
  return data;
};
