var  FunnyToken = artifacts.require("FunnyToken");
    module.exports  =  function(deployer) {
        deployer.deploy(FunnyToken, 1000000000000);
};
