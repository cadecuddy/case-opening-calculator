import axios from "axios";
import mysql from "mysql2";
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

const CASES_URL =
  "https://steamcommunity.com/market/search/render/?search_descriptions=0&query=case&sort_column=default&sort_dir=desc&appid=730&norender=1&count=50&category_730_Type[]=tag_CSGO_Type_WeaponCase";
const PACKAGES_URL = (start: number) =>
  `https://steamcommunity.com/market/search/render/?query=package&search_descriptions=case&sort_column=price_desc&sort_dir=desc&appid=730&norender=1&count=100&category_730_Type[]=tag_CSGO_Type_WeaponCase&start=${start}`;
const CAPSULES_URL = (start: number) =>
  `https://steamcommunity.com/market/search/render/?query=capsule&search_descriptions=case&sort_column=default&sort_dir=asc&appid=730&norender=1&count=100&category_730_Type[]=tag_CSGO_Type_WeaponCase&start=${start}`;

const LISTING_BASE = "https://steamcommunity.com/market/listings/730/";

function connectToDB(): Promise<mysql.Connection> {
  let connection: mysql.Connection;
  return new Promise((resolve, reject) => {
    if (connection) {
      // If the connection already exists, return it
      resolve(connection);
    } else {
      // Otherwise, create a new connection and save it for future use
      connection = mysql.createConnection(process.env.DATABASE_URL);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          reject(err);
          return;
        }
        console.log("Connected to MySQL");

        connection.query(
          `CREATE TABLE IF NOT EXISTS Listing (
            name VARCHAR(255) PRIMARY KEY,
            price FLOAT,
            listings INT,
            image TEXT,
            url TEXT,
            type VARCHAR(255),
            lastUpdated TIMESTAMP
          );`
        );

        connection.query(
          `CREATE TABLE IF NOT EXISTS PriceHistory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            price FLOAT,
            listings INT,
            type VARCHAR(255),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        );

        connection.query(
          `ALTER TABLE Listing MODIFY COLUMN image TEXT;`,
          (err, results) => {
            if (err) {
              console.error("Error modifying table schema:", err);
              reject(err);
              return;
            }
            resolve(connection);
          }
        );
      });
    }
  });
}

async function fetchCases(db: mysql.Connection) {
  const response = await axios.get(CASES_URL);

  if (response.data.success !== true || response.data.total_count < 39) {
    throw new Error("Case response was not successful");
  }

  const items = response.data.results;

  // Parse response into CaseListing objects
  const caseListings: Listing[] = items.map((item: any) => ({
    name: item.name,
    price: item.sell_price / 100,
    listings: item.sell_listings,
    image: item.asset_description.icon_url,
    url: LISTING_BASE + item.hash_name,
    type: "CASE",
    lastUpdated: new Date(),
  }));

  await saveToDB(db, caseListings, "CASE");
}

async function fetchPackages(db: mysql.Connection, totalItems: number) {
  const packageListings = new Set<Listing>();

  for (let i = 0; i < 2; i++) {
    for (let currentPos = 0; currentPos < totalItems; currentPos += 100) {
      const response = await axios.get(PACKAGES_URL(currentPos));
      if (response.data.success !== true) {
        throw new Error("Package response was not successful");
      }

      const data = response.data.results;
      const listings: Listing[] = data.map((item: any) => ({
        name: item.name,
        price: item.sell_price / 100,
        listings: item.sell_listings,
        image: item.asset_description.icon_url,
        url: LISTING_BASE + item.hash_name,
        type: "PACKAGE",
        lastUpdated: new Date(),
      }));

      listings.forEach((listing) => packageListings.add(listing));
      // sleep from 1 to 3 seconds
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
    }
  }

  await saveToDB(db, Array.from(packageListings), "PACKAGE");
}

async function fetchCapsules(db: mysql.Connection, totalItems: number) {
  const capsuleListings = new Set<Listing>();

  for (let i = 0; i < 2; i++) {
    for (let currentPos = 0; currentPos < totalItems; currentPos += 100) {
      const response = await axios.get(CAPSULES_URL(currentPos));
      if (response.data.success !== true) {
        throw new Error("Capsule response was not successful");
      }

      const data = response.data.results;
      const listings: Listing[] = data.map((item: any) => ({
        name: item.name,
        price: item.sell_price / 100,
        listings: item.sell_listings,
        image: item.asset_description.icon_url,
        url: LISTING_BASE + item.hash_name,
        type: "CAPSULE",
        lastUpdated: new Date(),
      }));

      listings.forEach((listing) => capsuleListings.add(listing));
      // sleep from 1 to 3 seconds
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
    }
  }

  await saveToDB(db, Array.from(capsuleListings), "CAPSULE");
}

async function saveToDB(db: mysql.Connection, listings: any, type: string) {
  await Promise.all(
    listings.map((listing: Listing) => {
      const { name, price, listings, image, url, type, lastUpdated } = listing;
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO Listing (name, price, listings, image, url, type, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price = ?, listings = ?, image = ?, url = ?, type = ?, lastUpdated = ?;",
          [
            name,
            price,
            listings,
            image,
            url,
            type,
            lastUpdated,
            price,
            listings,
            image,
            url,
            type,
            lastUpdated,
          ],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });
    })
  );

  // Save historical prices to database
  await Promise.all(
    listings.map((listing: Listing) => {
      const { name, price, listings, type } = listing;
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO PriceHistory (name, price, listings, type) VALUES (?, ?, ?, ?);",
          [name, price, listings, type],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });
    })
  );

  console.log(`Fetched ${listings.length} ${type} listings`);
}

async function fetchPrices() {
  try {
    const db = await connectToDB();

    await fetchCases(db);
    await fetchCapsules(db, 193);
    await fetchPackages(db, 115);

    console.log("Updated database at " + new Date().toLocaleString());
    db.end();
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

// DEV ONLY
// fetchPrices();

// LAMBDA HANDLER
exports.handler = async (event: any) => {
  await fetchPrices();
  return { statusCode: 200, body: "Successfully fetched case listings." };
};
