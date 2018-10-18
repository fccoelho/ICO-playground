var  FunnyToken = artifacts.require("FunnyToken");
var  TokenSale = artifacts.require("TokenSale");
var storage = {};
module.exports  = function(deployer, network, accounts) {
    return deployer.deploy(FunnyToken, 1000000000000)
        .then(()=>{
            return deployer.deploy(TokenSale, 10, accounts[0], FunnyToken.address)
        });
};
