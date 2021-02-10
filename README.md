# Charon
## Browser extension for Decentr
* Supports by Chrome browser v58 and above, Firefox browser v56 and above;
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
### Chrome
1. Run watch for Chrome:
   ```bash
   npm run watch:chrome
   ```
1. Enable [Chrome Extensions Developer Mode](https://developer.chrome.com/extensions/faq#faq-dev-01) in Chrome.
1. In Settings > Extensions click "Load unpacked extension" and select the `dist/` subfolder of this repository.

### Firefox
1. Run watch for Firefox:
   ```bash
   npm run watch:firefox
   ```
   1. Open `about:debugging` tab in Firefox.
1. Select the `dist/manifest.json` clicking by "Load Temporary Add-On".

## Build (production)
1. Run build PROD:
   ```bash
   // Chrome
   npm run build:chrome:prod
   
   // Firefox
   npm run build:firefox:prod
   ```
1. In root folder you will get zipped extension build.

---

### Follow us!
Your data is value. Decentr makes your data payable and tradeable online.
* [Medium](https://medium.com/@DecentrNet)
* [Twitter](https://twitter.com/DecentrNet)
* [Telegram](https://t.me/DecentrNet)
