# Charon
## Browser extension for Decentr
* Supports by Chromium browser v58 and above;
* Browser extension interacts with Blockchain by [Decentr.js](https://www.npmjs.com/package/decentr-js) library;
* Password of the local user is encrypted by SHA-256;

## Preparation to run
1. Install NodeJS.
1. Make a clone of Charon repository.
1. Install npm dependencies:
   ```bash
   npm i
   ```

## Run
### Chromium
1. Run watch:
   ```bash
   npm run watch
   ```
1. Enable [Chrome Extensions Developer Mode](https://developer.chrome.com/extensions/faq#faq-dev-01) in Chrome.
1. In Settings > Extensions click "Load unpacked extension" and select the `dist/` subfolder of this repository.

## Build (production)
1. Run build PROD:
   ```bash
   npm run build:prod
   ```
1. In root folder you will get zipped extension build.

---

### Follow us!
Your data is value. Decentr makes your data payable and tradeable online.
* [Medium](https://medium.com/@DecentrNet)
* [Twitter](https://twitter.com/DecentrNet)
* [Telegram](https://t.me/DecentrNet)
* [Discord](https://discord.gg/VMUt7yw92B)
