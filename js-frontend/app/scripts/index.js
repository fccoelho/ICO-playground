// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import {default as Web3} from 'web3'
import {default as contract} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import funnyTokenArtifact from '../../../FunnyToken/build/contracts/FunnyToken.json'
import tokenSaleArtifact from '../../../FunnyToken/build/contracts/TokenSale.json'

// FunnyToken is our usable abstraction, which we'll use through the code below.
const FunnyToken = contract(funnyTokenArtifact)
const TokenSale = contract(tokenSaleArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
    start: function () {
        const self = this

        // Bootstrap the FunnyToken abstraction for Use.
        FunnyToken.setProvider(web3.currentProvider)

        // Get the initial account balance so it can be displayed.
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert('There was an error fetching your accounts.')
                return
            }

            if (accs.length === 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
                return
            }

            accounts = accs
            account = accounts[0]

            self.refreshBalance()
        })
    },

    setStatus: function (message) {
        const status = document.getElementById('status')
        status.innerHTML = message
    },

    refreshBalance: function () {
        const self = this

        let funny;
        FunnyToken.deployed().then(function (instance) {
            funny = instance
            return funny.balanceOf.call(account, {from: account})
        }).then(function (value) {
            const balanceElement = document.getElementById('balance')
            balanceElement.innerHTML = value.valueOf()
        }).catch(function (e) {
            console.log(e)
            self.setStatus('Error getting balance; see log.')
        })
        // console.log("Trying to do the qrcode")
        // let sale;
        // TokenSale.deployed().then(inst => sale=inst)
        // jQuery('#qrcode').qrcode({text: sale.address.toString()});
    },

    sendCoin: function () {
        const self = this

        const amount = parseInt(document.getElementById('amount').value)
        const receiver = document.getElementById('receiver').value

        this.setStatus('Initiating transaction... (please wait)')

        let funny
        FunnyToken.deployed().then(function (instance) {
            funny = instance
            return funny.sendCoin(receiver, amount, {from: account})
        }).then(function () {
            self.setStatus('Transaction complete!')
            self.refreshBalance()
        }).catch(function (e) {
            console.log(e)
            self.setStatus('Error sending coin; see log.')
        })
    }
}

window.App = App;

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn(
            'Using web3 detected from external source.' +
            ' If you find that your accounts don\'t appear or you have 0 FunnyToken,' +
            ' ensure you\'ve configured that source properly.' +
            ' If using MetaMask, see the following link.' +
            ' Feel free to delete this warning. :)' +
            ' http://truffleframework.com/tutorials/truffle-and-metamask'
        );
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider)
    } else {
        console.warn(
            'No web3 detected. Falling back to http://127.0.0.1:8545.' +
            ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
            ' Consider switching to Metamask for development.' +
            ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
        )
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    }
    console.log("starting")
    App.start()
})
