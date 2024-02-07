# Solidity in Browser Demo

Project to test and demonstrate how to use Solidity in the browser.

## How to run

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open your browser and go to `http://localhost:3000`
5. Select a compiler
6. Select a file to compile. Also provided is a simple JSON example.
7. Compile
8. The compiled code will be output.

## Errors

There are some workarounds and considerations to take into account when using Solidity in the browser.

1. The solc-js's node dependencies need to be polyfilled. To see the errors before polyfilling see branch [without-polyfill-and-browserify](https://github.com/kuzdogan/solidity-in-browser/tree/without-polyfill-and-browserify)
2. It is not possible to load a different compiler version in the Worker. One has to terminate the worker and create a new one with the new compiler version, otherwise an error "Invalid Version" is thrown. To see the error check the branch [invalid-version](https://github.com/kuzdogan/solidity-in-browser/tree/invalid-version)

## Debug

To debug the code in VSCode first run it with:

```bash
npm start
```

Then switch to the debug tab and select `Launch Chrome against localhost` and press the play button. This will open a new Chrome window with the debugger attached.
