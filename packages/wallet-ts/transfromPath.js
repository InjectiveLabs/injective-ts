const fs = require('fs');
const path = require('path');

const buildType = process.env.BUILD_TYPE;

const cjsModule = "@ledgerhq/hw-app-eth/lib/services/ledger";

const esmModule = "@ledgerhq/hw-app-eth/lib-es/services/ledger";

const searchString = (buildType === "ESM") ? cjsModule : esmModule;
const replaceString = (buildType === "ESM") ? esmModule : cjsModule;

const filePath = './src/strategies/wallet-strategy/strategies/Ledger/Base.ts';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const updatedData = data.replace(new RegExp(searchString, 'g'), replaceString);

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }

        console.log(`Replaced in ${filePath}`);
    });
});
