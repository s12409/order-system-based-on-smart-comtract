const OnlineOrderingSystem = artifacts.require("OnlineOrderingSystem");

module.exports = function (deployer) {
    deployer.deploy(OnlineOrderingSystem);
};
