pragma solidity ^0.8.0;

import "./Token.sol";

contract vBank{

    Token private token;
    mapping (address=>uint) public ethBalanceOf;
    mapping (address=>uint) public depositStart;
    mapping (address=>bool) public isDeposited;
    
    event Deposit(address indexed user,uint ethAmount,uint timeStart);
    event Withdraw(address indexed user,uint ethAmount,uint depositTime,uint interest);

    constructor(Token _token){
        token = _token;
    }

    function deposit() payable public{
        require(isDeposited[msg.sender]==false,"Error: deposit already active");
        require(msg.value>=1e16,"Error: Deposit must be >=0.01 ETH");
        ethBalanceOf[msg.sender] = ethBalanceOf[msg.sender]+msg.value;
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        isDeposited[msg.sender] = true;
        emit Deposit(msg.sender,msg.value,block.timestamp);
    }

    function withdraw() public{
        require(isDeposited[msg.sender]==true,"Error,no previous deposit");
        uint userBalance = ethBalanceOf[msg.sender];
        uint depositTime = block.timestamp - depositStart[msg.sender];

        uint interestPerSecond = 31668017 * (ethBalanceOf[msg.sender]/1e16);
        uint interest = interestPerSecond * depositTime;
        payable(msg.sender).transfer(userBalance);
        token.mint(msg.sender,interest);
        depositStart[msg.sender] = 0;
        ethBalanceOf[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        emit Withdraw(msg.sender,userBalance,depositTime,interest);
    }
}

