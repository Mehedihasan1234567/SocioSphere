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
import EditProfileModal from "@/components/EditProfileModal";

// STEP 1: DELETE THE LOCAL INTERFACE DEFINITIONS THAT WERE HERE

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileUpdate = (updatedUserData: Partial<UserProfile>) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, ...updatedUserData } : null
    );
  };

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
  }

  const displayUser = user || session?.user;
  const isOwnProfile = user ? session?.user?.id === user.id : false;
  const isFallbackToSession = !user && session?.user;

  console.log("User Profile Data:", user);

  return (
    <>
      {/* The Edit Profile Modal (invisible by default) */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />

      <main className="bg-slate-900 min-h-screen text-white">
        <div className="container mx-auto p-4 max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-8">
            <Image
              src={displayUser.image ?? "/default-avatar.png"}
              width={128}
              height={128}
              alt={`${displayUser.name ?? "User"}'s avatar`}
              className="w-32 h-32 rounded-full border-4 border-slate-700 mb-4 sm:mb-0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
              {isOwnProfile && (
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2">
                  <p className="text-slate-400 text-sm">
                    This is your public profile.
                  </p>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-xs font-bold px-3 py-1 rounded-md"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
              {isFallbackToSession && (
                <p className="text-slate-400 text-sm mt-2">
                  The requested user was not found. Showing your profile as a
                  fallback.
                </p>
              )}
            </div>
          </div>

          {user ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Posts by {user.name}</h2>
              {user.posts && user.posts.length > 0 ? (
                <div className="space-y-4">
                  {user.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-800 rounded-xl">
                  <h3 className="text-2xl font-bold text-white">
                    No Posts Yet
                  </h3>
                  <p className="text-slate-400 mt-2">
                    {isOwnProfile ? "You haven't" : `${user.name} hasn't`}{" "}
                    posted anything yet.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
