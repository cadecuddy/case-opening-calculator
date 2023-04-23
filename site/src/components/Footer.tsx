/* eslint-disable @typescript-eslint/no-empty-interface */
import React from "react";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-8 bg-steamDark bg-opacity-75 p-4">
      <div className="container mx-auto">
        <div className="text-center text-neutral-200">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://steamcommunity.com/id/tevxn/"
            target="_blank"
            className="hover:text-red-500 hover:underline"
          >
            tevxn
          </a>
        </div>
      </div>
    </footer>
  );
};
