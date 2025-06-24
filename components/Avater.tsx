// src/components/ui/Avatar.tsx

import Image from "next/image";

// Define the props the Avatar component will accept
interface AvatarProps {
  // We only need the part of the user object with name and image
  user: {
    name?: string | null;
    image?: string | null;
  } | null;

  className?: string;

  size?: number;

  [key: string]: any;
}

/**
 * A reusable Avatar component that displays a user's image
 * with a fallback to a default image.
 */
export const Avatar = ({
  user,
  className,
  size = 48,
  ...rest
}: AvatarProps) => {
  // --- The logic is now centralized here ---
  const src = user?.image ?? "/default-avatar.png";
  const altText = `${user?.name ?? "User"}'s avatar`;

  return (
    <Image
      src={src}
      alt={altText}
      width={size}
      height={size}
      // Combine default classes with any custom classes
      className={`rounded-full object-cover ${className}`}
      // Pass any other props like 'priority' down to the Image component
      {...rest}
    />
  );
};
