"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface User {
  name: string | null;
  image: string | null;
}

interface UserAvatarProps {
  userId: string | null | undefined;
  size?: number;
}

export const UserAvatar = ({ userId, size = 48 }: UserAvatarProps) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <div
        className="rounded-full bg-slate-700 animate-pulse"
        style={{ width: size, height: size }}
      />
    );
  }

  const finalImageUrl =
    user?.image ?? session?.user?.image ?? "/default-avatar.png";
  const altText = `${user?.name || "User"}'s avatar`;

  return (
    <Image
      src={finalImageUrl}
      alt={altText}
      width={size}
      height={size}
      className="rounded-full border-2 border-slate-600"
    />
  );
};
