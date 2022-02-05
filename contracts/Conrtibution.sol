//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Contribution {
    address public owner;
    address[] private benefactors;
    mapping (address => uint) private beneractorsToAmount;
    uint public totalBalance;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function makeDonat() public payable {
        require(msg.value >= .001 ether, "You need send value more then .001");
        beneractorsToAmount[msg.sender] += msg.value;
        benefactors.push(msg.sender);
        totalBalance += msg.value;
    }

    function sendTo(address payable _to, uint amount) public payable onlyOwner{
        require(amount < totalBalance, "There is not that amount");
        _to.transfer(amount);
        totalBalance -= amount;
    }

    function getBenefactors() public view returns (address[] memory) {
        return benefactors;
    }

    function getTotalDonatsOfAddress(address beneractor) public view returns(uint) {
        require(beneractorsToAmount[beneractor] != 0, "There is not this benefactor");
        return beneractorsToAmount[beneractor];
    }
}