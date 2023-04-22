import React from "react";
import { Navbar } from "y/components/Navbar";
import { Footer } from "y/components/Footer";
import { Rubik } from "next/font/google";

interface LayoutProps {
  children: React.ReactNode;
}

const rubik = Rubik({
  style: "normal",
  weight: "600",
  subsets: ["latin"],
});

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={rubik.className + " flex min-h-screen flex-col"}>
      <Navbar />
      <main className="px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};
