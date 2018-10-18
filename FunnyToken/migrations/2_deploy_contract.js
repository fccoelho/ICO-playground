const fs  = require('fs');
var  FunnyToken = artifacts.require("FunnyToken");
var  TokenSale = artifacts.require("TokenSale");
    module.exports  = async function(deployer, network, accounts) {
        deployer.deploy(FunnyToken, 1000000000000)
            .then(function(){
                deployer.deploy(TokenSale, 1, accounts[0], FunnyToken.address);
            });

        var T = FunnyToken.deployed();
        var S = TokenSale.deployed();
        const storage = {'TOKEN_ADDRESS': T.address,
                        'SALE_ADDRESS': S.address
        };
        const output = JSON.stringify(storage);
        console.log(output)
        fs.writeFileSync('.address.json',output, 'utf-8');


        // console.log(process.env.TOKEN_ADDRESS)
};
