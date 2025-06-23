import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await request.json();
  if (!postId) {
    return NextResponse.json({ error: "PostId is required" }, { status: 400 });
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ message: "Unliked" }, { status: 200 });
    } else {
      // Like the post
      const like = await prisma.like.create({
        data: {
          post: {
            connect: { id: postId },
          },
          user: {
            connect: { email: session.user.email },
          },
        },
      });
      return NextResponse.json(like, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
