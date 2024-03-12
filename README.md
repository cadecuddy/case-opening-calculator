# CS2 Case Calculator
A cost calculator for CS2 container unboxings - available at [casecalculator.app](https://www.casecalculator.app/)

![image](https://user-images.githubusercontent.com/53287407/236367403-8bd0382a-e0d4-4b43-aa83-8d3eacc5c62c.png)

## Features ✅
- [x] Real-time fetching of CS2 case, capsule, and package data from the Steam Community Market
  - [ ] 3rd-party market data (Skinport, Buff, etc.)
- [x] Container filtering
- [x] Sorting options (Price, Alphabetical)
- [x] Search functionality
- [x] International currency support
- [ ] Container Price History
- [ ] Container Collection Info

## Stack 📚
This monorepo contains 2 directories:
### fetch-prices/
`index.ts` - lambda handler that queries the Steam Community Market for container prices & updates Postgresql DB (Planetscale). Queried every 15 mins via AWS EventBridge Scheduler
### site/
Webapp built with [create-T3-app](https://create.t3.gg/):
- NextJS
- TypeScript
- TailwindCSS
- tRPC
- Prisma


## Contributing 🤝

Any contributions from the community are appreciated. If you're interested, please do the following:
1. Fork the repository
2. Create a new branch w/ descriptive name
3. Make clear and concise commits
4. PR to main
