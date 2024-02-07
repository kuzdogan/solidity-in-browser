# Solidity in Browser Demo

Project to test and demonstrate how to use Solidity in the browser.

This branch the error "Invalid Version" when trying to change compiler versions in the Worker.

First we've resolved the polyfill issues.. Here we've added `@craco/craco` and the `craco.config.js` file to the project to override the webpack configuration. Then we've installed the dependencies to be polyfilled (to be seen in the `package.json`) and polyfilled them in the `craco.config.js` file.

## How to run

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open your browser and go to `http://localhost:3000`
5. Select a compiler
6. Change the compiler version

## Debug

To debug the code in VSCode first run it with:

```bash
npm start
```

Then switch to the debug tab and select `Launch Chrome against localhost` and press the play button. This will open a new Chrome window with the debugger attached.
