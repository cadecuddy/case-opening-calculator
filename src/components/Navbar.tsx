// src/components/Navbar.tsx
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
    <Link href="/faq" className="text-white">
      FAQ
    </Link>
    <Link
      href="https://steamcommunity.com/tradeoffer/new/?partner=113227539&token=2JhlD5KH"
      target="_blank"
    >
      <button class="group relative h-12 w-36 overflow-hidden bg-green-50 text-lg shadow">
        <div class="absolute inset-0 w-3 bg-green-500 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
        <span class="relative text-black group-hover:text-white">
          Donate (skins)
        </span>
      </button>
    </Link>
  </div>
);

const MobileSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div
    className={`fixed left-0 top-0 z-10 h-full w-64 bg-slate-800 bg-opacity-75 transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } lg:hidden`}
  >
    <div className="mt-12 flex flex-col space-y-4 p-4">
      <Link href="/faq" className="text-white">
        FAQ
      </Link>
      <Link
        href="https://steamcommunity.com/tradeoffer/new/?partner=113227539&token=2JhlD5KH"
        target="_blank"
      >
        <button class="group relative h-12 w-36 overflow-hidden bg-green-50 text-lg shadow">
          <div class="absolute inset-0 w-3 bg-green-500 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span class="relative text-black group-hover:text-white">
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
    <nav className="bg-slate-800 bg-opacity-75 p-4 text-neutral-100 shadow-md">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-roboto cursor-pointer text-center text-xl font-semibold sm:text-left"
          >
            CSGO Case Opening Calculator
          </Link>
          <MobileMenuButton onClick={toggleMenu} />
          <DesktopMenuItems />
        </div>
      </div>
      <MobileSidebar isOpen={isOpen} />
    </nav>
  );
};
