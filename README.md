# ACGN Stock Museum

The Museum of [ACGN Stock](https://acgn-stock.com/).

This website is built on the results of stock market.

All the pages are static content.

- - -

## Project Preview

[ACGN Museum](https://museum.acgn-stock.com)

- - -

## This project is currently built on

- [Astro](https://astro.build/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

and boilerplate:
[astro-preact-typescript-tailwind-boilerplate](https://github.com/erase2004/astro-preact-typescript-tailwind-boilerplate)

![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

- - -
## Environemt Variables

| Variable name | Data type | Default value | Description |
| --- | --- | --- | --- |
| DB_URI | string | `mongodb://127.0.0.1:27017` | MongoDB connection string |
| RUN_ALL_TEST | boolean | `undefined` | Run all e2e test cases |

- - -

## Usage Guide

* Project setup
  1. Setup MongoDB, import round databases.  Valid database names are list in [siteList](./src/configs/sites.ts).
  2. Write environemtn variable config file.  Place it in `${project root directory}/.env`.
  3. Use `yarn install` to install package dependencies.

* Run E2E tests
  * `yarn run test:e2e`

* Compiles for production
  * `yarn build`

* Lighthouse benchmark
  * For mobile: `yarn lh:mobile`
  * For desktop: `yarn lh:desktop`

## Todo List

* [x] Add round 1 to round 5 results
  * [x] Round 1
  * [x] Round 2
  * [x] Round 3
  * [x] Round 4
  * [x] Round 5
* [ ] Add build action to CI/CD pipeline
  * [ ] Upload build artifact to external storage. (Due to GitHub quota limit)

## License

[MIT](./LICENSE)