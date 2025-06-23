// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// We are overriding the module to add our own property
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // Our user object will now have a 'id' property
    user: {
      /** The user's database ID. */
      id: string;
    } & DefaultSession["user"]; // ...and the default properties (name, email, image)
  }
}
