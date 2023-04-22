import axios from "axios";
import * as redis from "redis";
import * as dotenv from "dotenv";

const CASE_URL =
  "https://steamcommunity.com/market/search/render/?search_descriptions=0&query=case&sort_column=default&sort_dir=desc&appid=730&norender=1&count=50&category_730_Type[]=tag_CSGO_Type_WeaponCase";
const IMAGE_BASE =
  "https://community.cloudflare.steamstatic.com/economy/image/";

const client = redis.createClient();
const axious = require("axios");

const fs = require("fs");
const file = fs.createWriteStream("cases.json");

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (error) => {
  console.error("Error connecting to Redis:", error);
});

async function fetchPrices() {
  // open a json file to write to
  file.write("[\n");

  try {
    const response = await axios.get(CASE_URL);
    const items = response.data.results;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const caseListing = {
        name: item.name,
        price: item.sell_price / 100,
        listings: item.sell_listings,
        image: IMAGE_BASE + item.asset_description.icon_url,
      };

      file.write(JSON.stringify(caseListing) + ",\n");
    }
  } catch (error) {
    console.error("ERROR FETCHING CASE PRICES: " + error);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

// Fetch prices immediately when the script starts
fetchPrices();
file.write("]");
