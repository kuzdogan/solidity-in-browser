# Solidity in Browser Demo

Project to test and demonstrate how to use Solidity in the browser.

## How to run

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open your browser and go to `http://localhost:3000`

_Current version will throw compile errors due to libraries not found in browser but in node_

To temporarily get rid of compiler errors, comment out the lines with `CompilerWorker`.

## Debug

To debug the code in VSCode first run it with:

```bash
npm start
```

Then switch to the debug tab and select `Launch Chrome against localhost` and press the play button. This will open a new Chrome window with the debugger attached.
