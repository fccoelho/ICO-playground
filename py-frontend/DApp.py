from flask import Flask
from flask import render_template
from flask_foundation import Foundation
from flask import request
import web3
from web3 import Web3, HTTPProvider, TestRPCProvider
from web3.contract import ConciseContract
import json




w3 = Web3()  # Auto-detects connection settings

with open('../FunnyToken/build/contracts/FunnyToken.json') as f:
    token_artifact = json.load(f)
with open('../FunnyToken/build/contracts/TokenSale.json') as f:
    sale_artifact = json.load(f)

token_address = Web3.toChecksumAddress(list(token_artifact['networks'].values())[0]['address'])
sale_address = Web3.toChecksumAddress(list(sale_artifact['networks'].values())[0]['address'])


token_contract_instance = w3.eth.contract(address=token_address, abi=token_artifact['abi'])
sale_contract_instance = w3.eth.contract(address=sale_address, abi=sale_artifact['abi'])
account = w3.eth.accounts[0]

app = Flask(__name__)

Foundation(app)

app.config['FOUNDATION_USE_MINIFIED'] = True
app.config['FOUNDATION_USE_CDN'] = True
app.config['SECRET_KEY'] = 'devkey'



@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'POST':
        try:
            address = Web3.toChecksumAddress(request.form['address'])
        except ValueError:
            pass
    else:
        address = account
    bal = token_contract_instance.functions.balanceOf(address).call()
    return render_template('index.html', balance=bal, address=sale_address, account=account)
