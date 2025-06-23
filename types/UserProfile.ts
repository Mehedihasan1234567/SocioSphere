import { Post } from "./post"; // We import the Post type to use it here

export interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  posts: Post[];
}
