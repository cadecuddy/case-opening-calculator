# CSGO Case Opening Calculator

# TL;DR
User Input: budget
- Descending list displayed based on current case + key prices & tax rates
  - List is in order of cheapest case (most cases they can open) --> least

User Input: budget + case type
- How many they can open

User Input: budget + multiple case types
- Split the budget evenly between the case types
  - User can then adjust quantities of a case(s) manually

# UI

## Navbar
- Donatation trade link :)
- Locale selection
  - Will adjust currency based on selection
  - Flag > Locale > Currency on dropdown each dropdown item
- FAQ

## Main Area
- Tab to switch between case / capsules
- Budget input + calculate button
  - "Enter" accepted as valid submission

### Case Listing
- Case Icon
- Price underneath
- Last 30 min price underneath that

## Backend
- Check SCM price of every case/capsule every 30 mins
  - Save to db, accessible via internal API
  - Cache response on each update for quick access
- Fetch currency conversion rates from that one API
  - Save to db
- Items not on market (i.e. Kato 2014 capsules)
  - Display "No price data"

# Monetization
- Reflinks to skin sites
  - i.e. "Buy these cases for $xxx on skinport, etc."
- Donations (prob not many), maybe put on alt

