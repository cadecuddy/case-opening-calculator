import React from "react";
import Head from "next/head";

interface MetaHeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const MetaHeader: React.FC<MetaHeaderProps> = ({
  title = "CS:GO Case Opening Calculator",
  description = "Calculate the cost of your csgo unboxing experience. Select cases and see real-time case prices.",
  keywords = "CSGO, case, opening, calculator, budget, tool, csgo unboxing calculator, unboxing, CS:GO, cs2",
  ogImage = "/images/og-image.jpg",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
