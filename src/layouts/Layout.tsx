import React from "react";
import { Navbar } from "y/components/Navbar";
import { Footer } from "y/components/Footer";
import { Roboto } from "next/font/google";

interface LayoutProps {
  children: React.ReactNode;
}

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={roboto.className + " flex min-h-screen flex-col"}>
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};
