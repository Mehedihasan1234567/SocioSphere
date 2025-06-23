"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const LeftSideBar = () => {
  const { data: session } = useSession();

  if (!session) return null;

  console.log("Session data:", session);
  return (
    <div>
      <aside className="hidden lg:block sticky top-24 h-fit bg-slate-800 p-5 rounded-xl shadow-lg">
        <Image
          src={session?.user?.image ?? "/default-avatar.png"}
          width={96}
          height={96}
          alt="Your avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700"
        />
        <h2 className="text-xl font-bold text-white text-center">
          {session.user?.name}
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          @{session.user?.name?.toLowerCase().replace(" ", "")}
        </p>
        <Link
          href={`/users/${session.user?.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </aside>
    </div>
  );
};
