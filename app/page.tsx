import HomePage from "@/components/HomePage";
import prisma from "@/lib/prisma";

async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    imageUrl: post.imageUrl ?? undefined,
    author: {
      ...post.author,
      emailVerified: post.author.emailVerified?.toISOString() ?? null,
    },
    comments: post.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      author: {
        ...comment.author,
        emailVerified: comment.author.emailVerified?.toISOString() ?? null,
      },
    })),
  }));
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="">
      <HomePage serverPosts={posts} />
    </main>
  );
}
