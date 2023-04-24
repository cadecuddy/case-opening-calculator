/* eslint-disable @typescript-eslint/no-empty-interface */
// src/components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface NavbarProps {}

const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button className="text-white lg:hidden" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
);

const DesktopMenuItems: React.FC = () => (
  <div className="hidden items-center space-x-8 lg:flex">
    <Link
      href="/faq"
      className="text-neutral-300 transition-colors duration-100 ease-in hover:text-white"
    >
      FAQ
    </Link>
    <Link
      href="https://steamcommunity.com/tradeoffer/new/?partner=113227539&token=2JhlD5KH"
      target="_blank"
    >
      <button className="group relative h-12 w-36 overflow-hidden bg-green-50 text-base shadow">
        <div className="absolute inset-0 w-3 bg-green-500 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
        <span className="relative text-black group-hover:text-white">
          Donate (skins)
        </span>
      </button>
    </Link>
  </div>
);

const MobileSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div
    className={`transition-height absolute left-0 top-[5.3rem] z-10 w-full bg-slate-800 bg-opacity-75 duration-300 ease-in-out ${
      isOpen ? "h-[calc(100vh-3.5rem)]" : "h-0"
    } overflow-hidden lg:hidden`}
  >
    <div className="mt-2 flex flex-col space-y-4 p-4 text-center">
      <Link href="/faq" className="text-white hover:underline">
        FAQ
      </Link>
      <Link
        href="https://steamcommunity.com/tradeoffer/new/?partner=113227539&token=2JhlD5KH"
        target="_blank"
      >
        <button className="group relative h-12 w-1/2 overflow-hidden bg-green-50 text-lg shadow">
          <div className="absolute inset-0 w-3 bg-green-500 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-black group-hover:text-white">
            Donate (skins)
          </span>
        </button>
      </Link>
    </div>
  </div>
);

export const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="p-4 pt-8 text-neutral-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between text-lg">
            <Link
              href="/"
              className="font-roboto cursor-pointer text-center text-3xl font-semibold transition duration-150 ease-in sm:text-left"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsXE1xNwVDv7WrFA5pnabNJGwSuN3gxtnawKOlMO6HzzhQucAm0uvFo4n2iw3h_UM-ZmilJNeLMlhpjfjxEoE"
                  alt="logo"
                  className="h-[4.5rem] w-20"
                  width={200}
                  height={200}
                />
                <span>
                  CASE
                  <br />
                  <span className="text-green-500">CALC</span>
                </span>
              </div>
            </Link>
            <MobileMenuButton onClick={toggleMenu} />
            <DesktopMenuItems />
          </div>
          <hr className="my-4 border-neutral-300" />
        </div>
        <MobileSidebar isOpen={isOpen} />
      </nav>
    </>
  );
};
