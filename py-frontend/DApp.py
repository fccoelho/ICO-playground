from flask import Flask
from flask import render_template
import web3
from web3 import Web3, HTTPProvider, TestRPCProvider
from web3.contract import ConciseContract
import json


w3 = Web3(HTTPProvider('localhost:8545'))
contract_address = Web3.toChecksumAddress('0xc6c817f52322a3edf269883eb1d612cb3fa096a2')
with open('../FunnyToken/build/contracts/FunnyToken.json') as f:
    abi = json.load(f)
    # abi = f.read()
contract_instance = w3.eth.contract(address=contract_address)#, abi=abi, ContractFactoryClass=ConciseContract)

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')
