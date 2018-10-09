pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract FunnyToken is ERC20 {
    uint256 private _totalSupply;
    address private owner;

    constructor(uint256 supply) public {
        _totalSupply = supply;
        owner = msg.sender;
        _mint(owner, supply/10);
    }
}

