import { UsersCollection } from "@/app/Services/Database/MongoServices";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "write a username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        try {
          const foundUser = await UsersCollection.findOne({
            username,
          });
          if (!foundUser || foundUser.password !== password) {
            const error = new Error("Invalid Credentials");
            error.status = 401;
            throw error;
          }
          return Promise.resolve({
            name: foundUser,
          });
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session }) {
      session.user = { ...session.user.name };
      delete session.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
