from flask import Flask
from flask import render_template
import web3
from web3 import Web3, HTTPProvider, TestRPCProvider
from web3.contract import ConciseContract
import json


w3 = Web3()#HTTPProvider('127.0.0.1:8545'))
contract_address = Web3.toChecksumAddress('0xc6c817f52322a3edf269883eb1d612cb3fa096a2')
with open('../FunnyToken/build/contracts/FunnyToken.json') as f:
    token_artifact = json.load(f)
    # abi = f.read()

token_contract_instance = w3.eth.contract(address=contract_address, abi=token_artifact['abi'])#, ContractFactoryClass=ConciseContract)
account = w3.eth.accounts[0]

app = Flask(__name__)

@app.route('/')
def hello_world():
    bal = token_contract_instance.functions.balanceOf(account).call()
    return render_template('index.html', balance=bal, address=contract_address, account=account)
