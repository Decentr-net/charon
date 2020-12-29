# Charon
## Browser extension for Decentr
* Supports by Chrome browser v58 and above, Firefox browser v56 and above;
* Extension based Angular 10 and TypeScript;
* Browser extension interacts with Blockchain by [Decentr.js](https://www.npmjs.com/package/decentr-js) library;
* Password of the local user is encrypted by SHA-256;
* Autolock the extension's private room in 40 mins inactive.

## Building locally
1. Install NodeJS.
1. Make a clone of Charon repository.
1. Install npm dependencies:
    ```bash
    npm i
    ```

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

---

### Follow us!
Your data is value. Decentr makes your data payable and tradeable online.
* [Medium](https://medium.com/@DecentrNet)
* [Twitter](https://twitter.com/DecentrNet)
* [Telegram](https://t.me/DecentrNet)
