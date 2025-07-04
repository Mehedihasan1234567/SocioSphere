"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Logo from "@/components/logo";
import Image from "next/image";
import { UserAvatar } from "./UserAvater";

const ProfileIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const SignOutIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-slate-900/70 backdrop-blur-lg text-white shadow-lg sticky top-0 z-50 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Logo />

            <div className="hidden md:flex items-center space-x-8">
              {status === "loading" ? (
                <div className="w-48 h-8 bg-slate-700 rounded animate-pulse"></div>
              ) : session ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex text-sm rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <UserAvatar userId={session.user.id} size={44} />
                  </button>
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-2xl py-2 bg-slate-800 ring-1 ring-white/10 focus:outline-none transition-all duration-300 ease-out">
                      <div className="px-4 py-3 border-b border-slate-600">
                        <p className="text-sm font-semibold text-white">
                          Signed in as
                        </p>
                        <p className="text-sm font-medium text-slate-400 truncate">
                          {session.user?.name}
                        </p>
                      </div>
                      <a
                        href={`/users/${session.user.id}`}
                        className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <ProfileIcon /> Your Profile
                      </a>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <SignOutIcon /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-x-4 flex items-center">
                  <button
                    onClick={() => signIn()}
                    className="text-slate-300 hover:text-white transition-colors text-sm font-semibold"
                  >
                    Log In
                  </button>
                  <a
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    Sign Up Free
                  </a>
                </div>
              )}
            </div>

            {/* -- MOBILE MENU BUTTON -- */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-7 w-7"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* -- MOBILE MENU OVERLAY -- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-6">
          <button
            onClick={closeMobileMenu}
            className="absolute top-6 right-6 p-2 rounded-md text-slate-400 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-8 w-8"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center">
            {session ? (
              <>
                <Image
                  width={96}
                  height={96}
                  src={session.user?.image ?? "/default-avatar.png"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700"
                />
                <h2 className="text-2xl font-bold text-white mb-1">
                  {session.user?.name}
                </h2>
                <p className="text-slate-400 mb-8">{session.user?.email}</p>
                <a
                  href={`/users/${session.user.id}`}
                  onClick={closeMobileMenu}
                  className="block text-2xl font-semibold text-white mb-6 hover:text-blue-400"
                >
                  Profile
                </a>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut();
                  }}
                  className="block w-full text-2xl font-semibold text-white hover:text-blue-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => {
                    closeMobileMenu();
                    signIn();
                  }}
                  className="block text-3xl font-semibold text-white mb-8 hover:text-blue-400"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="block w-full bg-blue-600 hover:bg-blue-500 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg"
                >
                  Sign Up Free
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
