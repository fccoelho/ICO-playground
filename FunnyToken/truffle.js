/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 * ```
 */

var HDWalletProvider = require("truffle-hdwallet-provider")
const mnemonic = "beyond eager yard box upper orbit because urban youth mystery render miracle"
//beyond eager yard box upper orbit because urban youth mystery render miracle

module.exports = {
 networks : {
    ganache : {
      host : 'localhost',
      port : 8545,    // By default Ganache runs on this port.
      network_id : "*" // network_id for ganache is 5777. However, by keeping * as value you can run this node on  any network
    },
     ropsten: {
        provider: function(){
            return new HDWalletProvider(mnemonic,'https://ropsten.infura.io/v3/8f62d68e09944a559e788e8f73a7f4ed')
        },
         network_id: 3,
         gas: 4500000,
     }
  }
};
