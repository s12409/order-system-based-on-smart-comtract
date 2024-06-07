//const Web3 = require('web3'); // 確保引用 Web3

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Ganache default network ID
        },
    },
    // 添加這行以指定 Solidity 編譯器版本
    compilers: {
        solc: {
            version: "0.8.5"
        }
    },
};
