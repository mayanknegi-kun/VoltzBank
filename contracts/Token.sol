pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    
    address public minter;

    event MinterChange(address indexed from,address to);

    constructor() public payable ERC20("Voltz Bank Currency", "VBC") {
        minter = msg.sender;
    }

    function passMinterRole(address vBank) public returns (bool){
        require(msg.sender==minter,"Error: only owner can change minter role");
        minter = vBank;
        emit MinterChange(msg.sender, vBank);
        return true;
    }

    function mint(address account,uint amount) public{
        require(msg.sender==minter,"Error : You are not authorised to mint");
        _mint(account,amount);
    }


}
