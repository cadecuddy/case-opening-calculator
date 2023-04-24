import axios from "axios";
import * as sqlite3 from "sqlite3";

interface CaseListing {
  name: string;
  price: number;
  listings: number;
  image: string;
  url: string;
  lastUpdated: Date;
}

const DB_PATH =
  "/home/cade/Code/projects/case-opening-calculator/site/prisma/db.sqlite";
const CASES_URL =
  "https://steamcommunity.com/market/search/render/?search_descriptions=0&query=case&sort_column=default&sort_dir=desc&appid=730&norender=1&count=50&category_730_Type[]=tag_CSGO_Type_WeaponCase";
const LISTING_BASE = "https://steamcommunity.com/market/listings/730/";
const IMAGE_BASE =
  "https://community.cloudflare.steamstatic.com/economy/image/";

async function connectToDB() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error connecting to SQLite:", err);
      return;
    }
    console.log("Connected to SQLite");
  });

  await db.run(
    `CREATE TABLE IF NOT EXISTS CaseListing (
      name TEXT PRIMARY KEY,
      price REAL,
      listings INTEGER,
      image TEXT,
      url TEXT,
      lastUpdated TEXT
    );`
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS CasePriceHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      listings INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  );

  return db;
}

const dbPromise = connectToDB();

async function fetchPrices() {
  try {
    const response = await axios.get(CASES_URL);

    if (response.data.success !== true || response.data.total_count < 39) {
      throw new Error("Response was not successful, retrying in 15 minutes");
    }

    const items = response.data.results;

    // Parse response into CaseListing objects
    const caseListings: CaseListing[] = items.map((item: any) => ({
      name: item.name,
      price: item.sell_price / 100,
      listings: item.sell_listings,
      image: IMAGE_BASE + item.asset_description.icon_url,
      url: LISTING_BASE + item.hash_name,
      lastUpdated: new Date(),
    }));

    // Save case listings to database
    const db = await dbPromise;

    await Promise.all(
      caseListings.map((caseListing) => {
        const { name, price, listings } = caseListing;
        return db.run(
          `INSERT INTO CasePriceHistory (name, price, listings) VALUES (?, ?, ?);`,
          [name, price, listings]
        );
      })
    );

    await Promise.all(
      caseListings.map((caseListing) => {
        const { name, price, listings, image, url, lastUpdated } = caseListing;
        return db.run(
          "INSERT OR REPLACE INTO CaseListing (name, price, listings, image, url, lastUpdated) VALUES (?, ?, ?, ?, ?, ?);",
          [name, price, listings, image, url, lastUpdated]
        );
      })
    );

    console.log("Successfully fetched case listings at", new Date());
  } catch (error) {
    console.error("Error fetching case listings:", error);
  } finally {
    (await dbPromise).close;
  }
}

// Fetch prices immediately when the script starts
fetchPrices();
