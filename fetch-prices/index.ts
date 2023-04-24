import axios from "axios";
import mysql from "mysql2";
require("dotenv").config();

interface CaseListing {
  name: string;
  price: number;
  listings: number;
  image: string;
  url: string;
  lastUpdated: Date;
}

const CASES_URL =
  "https://steamcommunity.com/market/search/render/?search_descriptions=0&query=case&sort_column=default&sort_dir=desc&appid=730&norender=1&count=50&category_730_Type[]=tag_CSGO_Type_WeaponCase";
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
          `CREATE TABLE IF NOT EXISTS CaseListing (
            name VARCHAR(255) PRIMARY KEY,
            price FLOAT,
            listings INT,
            image TEXT,
            url TEXT,
            lastUpdated TIMESTAMP
          );`
        );

        connection.query(
          `CREATE TABLE IF NOT EXISTS CasePriceHistory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            price FLOAT,
            listings INT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        );

        connection.query(
          `ALTER TABLE CaseListing MODIFY COLUMN image TEXT;`,
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
      image: item.asset_description.icon_url,
      url: LISTING_BASE + item.hash_name,
      lastUpdated: new Date(),
    }));

    const db = await connectToDB();
    // Save case listings to database
    await Promise.all(
      caseListings.map((caseListing) => {
        const { name, price, listings } = caseListing;
        return new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO CasePriceHistory (name, price, listings) VALUES (?, ?, ?);",
            [name, price, listings],
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });
      })
    );

    await Promise.all(
      caseListings.map((caseListing) => {
        const { name, price, listings, image, url, lastUpdated } = caseListing;
        return new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO CaseListing (name, price, listings, image, url, lastUpdated) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price = VALUES(price), listings = VALUES(listings), image = VALUES(image), url = VALUES(url), lastUpdated = VALUES(lastUpdated);",
            [name, price, listings, image, url, lastUpdated],
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });
      })
    );

    console.log("Successfully fetched case listings at", new Date());
    db.end();
  } catch (error) {
    console.error("Error fetching case listings:", error);
  }
}

fetchPrices();

// Fetch prices immediately when the script starts
// exports.handler = async (event: any) => {
//   await fetchPrices();
//   return { statusCode: 200, body: "Successfully fetched case listings." };
// };
