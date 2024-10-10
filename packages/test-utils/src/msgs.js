"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareEip712 = void 0;
const utils_1 = require("@injectivelabs/utils");
const networks_1 = require("@injectivelabs/networks");
const mocks_1 = require("./mocks");
const prepareEip712 = (messages) => {
    const endpoints = (0, networks_1.getNetworkEndpoints)(networks_1.Network.Devnet);
    const msgs = Array.isArray(messages) ? messages : [messages];
    const web3Msgs = msgs.map((msg) => msg.toWeb3());
    const { tx, eip712 } = mocks_1.mockFactory.eip712Tx;
    const { ethereumChainId } = eip712;
    const eip712Args = {
        msgs,
        fee: utils_1.DEFAULT_STD_FEE,
        tx: tx,
        ethereumChainId: ethereumChainId,
    };
    const prepareEip712Request = Object.assign(Object.assign({}, eip712), { chainId: ethereumChainId, message: web3Msgs, address: mocks_1.mockFactory.ethereumAddress });
    return { endpoints, eip712Args, prepareEip712Request };
};
exports.prepareEip712 = prepareEip712;
//# sourceMappingURL=msgs.js.map