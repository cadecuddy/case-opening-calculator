import React from "react";
import Head from "next/head";

interface MetaHeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const MetaHeader: React.FC<MetaHeaderProps> = ({
  title = "CS2 Case Opening Calculator",
  description = "Calculate the cost of a CS2 unboxing. Select from cases, sticker capsules, and souvenir packages - all with real-time prices in 160+ different currencies.",
  keywords = "CSGO, case, opening, calculator, budget, tool, csgo unboxing calculator, unboxing, CS:GO, cs2, counter strike, roi, profit calculator, profit, simulator, cs2 case, cs2 case simulator",
  ogImage = "/ogimg.png",
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
      <meta property="og:url" content="https://www.casecalculator.app/" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="casecalculator.app" />
      <meta property="twitter:url" content="https://www.casecalculator.app/" />
      <meta name="twitter:title" content="CS2 Case Opening Calculator" />
      <meta
        name="twitter:description"
        content="Calculate the cost of a CS2 unboxing. Select from cases, sticker capsules, and souvenir packages - all with real-time prices."
      />
      <meta
        name="twitter:image"
        content="https://casecalculator.app/ogimg.png"
      />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
