var  FunnyToken = artifacts.require("FunnyToken");
var  TokenSale = artifacts.require("TokenSale");
var storage = {};
module.exports  = function(deployer, network, accounts) {
    return deployer.deploy(FunnyToken)
        .then(()=>{
            return deployer.deploy(TokenSale, 10, accounts[0], FunnyToken.address)
        });
};
