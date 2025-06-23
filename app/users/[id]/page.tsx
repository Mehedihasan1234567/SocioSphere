"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { UserProfile } from "@/types/UserProfile";

// Import your components
import PostCard from "@/components/PostCard";
// Assuming you have a skeleton loader for the user profile page
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton";
import Image from "next/image";

// STEP 1: DELETE THE LOCAL INTERFACE DEFINITIONS THAT WERE HERE

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError("");
      fetch(`/api/users/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((data: UserProfile) => {
          // Type the incoming data correctly
          setUser(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Use a more fitting skeleton for this page
  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>This user does not exist.</p>
      </div>
    );
  } // Use the modern, dark theme consistent with the rest of the app

  const isOwnProfile = session?.user?.id === user.id;

  return (
    <main className="bg-slate-900 min-h-screen text-white">
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex items-center space-x-6 mb-8">
          <Image
            src={user.image ?? "/default-avatar.png"}
            width={128}
            height={128}
            alt="User avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-700"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
            {isOwnProfile && (
              <p className="text-slate-400 text-sm mt-1">
                This is your public profile.isOwnProfile
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Posts by {user.name}</h2>
          {user.posts.length > 0 ? (
            <div className="space-y-4">
              {user.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-800 rounded-xl">
              <h3 className="text-2xl font-bold text-white">No Posts Yet</h3>
              <p className="text-slate-400 mt-2">
                {isOwnProfile ? "You haven't" : `${user.name} hasn't`} posted
                anything yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
