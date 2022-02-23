const path = require('path');
const fs = require('fs');

const getScriptPath = (name) => path.join(__dirname, '..', '..', '..', 'dist', 'scripts', name);

const readScript = (name) => fs.readFileSync(
  getScriptPath(name),
  'utf8',
);

const INLINE_SCRIPT_NAME = 'webpage-api';

const CONTENT_API_SCRIPT_NAME = 'content-api-script';

const inlineWebpageAPI = () => {
  const webpageAPIScript = readScript(`${INLINE_SCRIPT_NAME}.js`)
    .replace(/\/\*([\s\S]*?)\*\//g, '')
    .replace(/(\r\n|\n|\r)/g, '')
    .replace(/["']/g, '`')
    // TODO: think about another way
    .replace('`mapTo()`', 'mapTo');

  const contentScript = readScript(`${CONTENT_API_SCRIPT_NAME}.js`);

  const newContentScript = contentScript
    .replace('WEBPAGE_API_CODE', webpageAPIScript);

  fs.writeFileSync(
    getScriptPath(`${CONTENT_API_SCRIPT_NAME}.js`),
    newContentScript,
  );

  fs.unlinkSync(getScriptPath(`${INLINE_SCRIPT_NAME}.js`));
}

class InlineWebpageAPIPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Inline WebpageAPI Plugin', () => {
      inlineWebpageAPI();
    });
  }
}

module.exports = {
  InlineWebpageAPIPlugin,
  INLINE_SCRIPT_NAME,
  CONTENT_API_SCRIPT_NAME,
};
