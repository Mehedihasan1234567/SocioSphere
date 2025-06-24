import { Comment } from "./Comment";

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  author: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  comments: Comment[]; // Now, this correctly refers to YOUR Comment interface
  likes: { userId: string }[];
}
