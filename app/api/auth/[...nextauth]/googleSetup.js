import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { getUserDetails } from "./getUserDetails";

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        access_type: "offline",
        prompt: "consent",
        response_type: "code",
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          scope: "profile email https://www.googleapis.com/auth/youtubepartner",
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const { id } = await getUserDetails({
          email: user.email,
          name: user.name,
          imageUrl: user.image,
        });
        token.expires_at = Date.now() + account.expires_at * 1000;
        token.credentials = { ...account };
        token.mongoId = id;
        token.googleId = user.id;
        return token;
      }
      if (Date.now() < token.expires_at) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.credentials = token.credentials;
      session.user.mongoId = token.mongoId;
      session.user.googleId = token.googleId;
      session.error = token.error;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
