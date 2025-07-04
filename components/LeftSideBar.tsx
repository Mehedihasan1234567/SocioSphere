"use client";
import { ArrowRight, User } from "lucide-react";
import { useSession } from "next-auth/react";

import Link from "next/link";
import React, { useState } from "react";
import { UserAvatar } from "./UserAvater";

export const LeftSideBar = () => {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  if (!session) return null;

  console.log("Session data:", session);
  return (
    <div>
      <aside className="hidden lg:block sticky top-24 h-fit bg-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <UserAvatar userId={session.user.id} size={96} />
        </div>
        <h2 className="text-xl font-bold text-white text-center uppercase">
          {session.user?.name}
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          @{session.user?.name?.toLowerCase().replace(" ", "")}
        </p>
        <Link href={`/users/${session.user?.id}`} className="">
          <button
            className="group relative w-full bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-lg text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 border border-white/20 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

            <div className="relative flex items-center justify-center gap-3">
              <User className="w-5 h-5" />
              <span>View Profile</span>
              <ArrowRight
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </div>
          </button>
        </Link>
      </aside>
    </div>
  );
};
