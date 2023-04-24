import React from "react";
import Head from "next/head";

interface MetaHeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const MetaHeader: React.FC<MetaHeaderProps> = ({
  title = "CSGO Case Opening Calculator",
  description = "Calculate how many cases you can open with your budget, choose case types, and see real-time case prices. Plan & optimize your unboxing experience 💵",
  keywords = "CSGO, case, opening, calculator, budget, tool",
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
