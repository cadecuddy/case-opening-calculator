import axios from "axios";
import { JSDOM } from "jsdom";
import mysql from "mysql2/promise";
import puppeteer from "puppeteer";
require("dotenv").config();

interface Listing {
  name: string;
  price: number;
  listings: number;
  image: string;
  url: string;
  type: string;
  lastUpdated: Date;
}

interface Collection {
  name: string;
  items: CollectionListing[];
}

interface CollectionListing {
  name: string;
  color: string;
  img: string;
  url: string;
  collection_id: string;
}

async function connectToDB(): Promise<mysql.Connection> {
  let connection: mysql.Connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log("Connected to MySQL");

    // Create Collection table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Collection (
        name VARCHAR(255),
        PRIMARY KEY (id)
      )
    `);

    // Create CollectionListing table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS CollectionListing (
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        color VARCHAR(255),
        img TEXT,
        url TEXT,
        collection_id VARCHAR(255),
        PRIMARY KEY (id)
      )
    `);
    console.log("Tables checked/created successfully");
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  return connection;
}

async function scrapeCollectionListings(
  listing: Listing
): Promise<CollectionListing[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on("console", (message) => {
    console.log(`From browser: ${message.text()}`);
  });

  // Go to the page and wait until network is idle
  await page.goto(listing.url, {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".descriptor");

  // Get HTML of the page
  const collectionListings: CollectionListing[] = await page.evaluate(() => {
    // Retrieve collection id
    const collectionId =
      document.querySelector("h1#largeiteminfo_item_name")?.textContent || "";

    // Retrieve all descriptor divs underneath "Contains one of the following"
    const descriptorDivs = Array.from(
      document.querySelectorAll("#largeiteminfo_item_descriptors .descriptor")
    );

    // Find the index of the div that contains "Contains one of the following"
    const startIndex = descriptorDivs.findIndex((div) =>
      div.textContent?.includes("Contains one of the following")
    );

    // end on a div that is blank or starts with the text "or the Exceedingly Rare"
    const endIndex = descriptorDivs.findIndex(
      (div, index) =>
        div.textContent?.includes("or the Exceedingly Rare") ||
        index === descriptorDivs.length - 1
    );

    // Map divs to CollectionListing objects
    return descriptorDivs.slice(startIndex + 1, endIndex).map((div) => {
      return {
        name: div.innerHTML || "",
        color: (div as HTMLElement).style.color,
        img: "",
        url: `https://steamcommunity.com/market/search?q=${div.innerHTML}&appid=730`,
        collection_id: collectionId,
      };
    });
  });

  await browser.close();

  return collectionListings;
}

async function scrapeCollections() {
  try {
    const db = await connectToDB();

    // Fetch all listings from the database
    const [rows] = await db.query("SELECT * FROM Listing");
    const listings: Listing[] = JSON.parse(JSON.stringify(rows)); // Conversion might not be needed depending on your mysql2 config

    // Scrape collection listings
    for (const listing of listings) {
      const collection = await scrapeCollectionListings(listing);

      // get the image url for each collection listing
      for (const listing of collection) {
        const { data } = await axios.get(
          `https://steamcommunity.com/market/search/render/?search_descriptions=0&query=${listing.name}&sort_column=default&sort_dir=desc&appid=730&norender=1&count=10`
        );
        listing.img = data.results[0].asset_description.icon_url;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 2000 + 1000)
        );
      }

      //sleep for 1 - 3 secs
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
    }

    console.log("Updated database at " + new Date().toLocaleString());
    await db.end();
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
}

// DEV ONLY
scrapeCollections();

// LAMBDA HANDLER
// exports.handler = async (event: any) => {
//   await fetchPrices();
//   return { statusCode: 200, body: "Successfully fetched case listings." };
// };
