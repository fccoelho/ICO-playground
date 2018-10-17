require('dotenv').config();
var  FunnyToken = artifacts.require("FunnyToken");
var  TokenSale = artifacts.require("TokenSale");
    module.exports  =  function(deployer, network, accounts) {
        deployer.deploy(FunnyToken, 1000000000000)
            .then(function(){
                deployer.deploy(TokenSale, 1, accounts[0], FunnyToken.address);
            });

        var T = FunnyToken.deployed();
        var S = TokenSale.deployed();
        process.env.TOKEN_ADDRESS = T.address;
        process.env.SALE_ADDRESS = S.address;
        // console.log(process.env.TOKEN_ADDRESS)
};
