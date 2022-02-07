//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Contribution {
    address public owner;
    address[] private benefactors;
    mapping (address => uint) private benefactorsToAmount;
    mapping (address => bool) private havingBenefactors;
    uint public totalBalance;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not an owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function makeDonat() public payable {
        require(msg.value >= .001 ether, "You need send value more then .001 coin");
        benefactorsToAmount[msg.sender] += msg.value;
        if (!havingBenefactors[msg.sender]) {
            benefactors.push(msg.sender);
            havingBenefactors[msg.sender] = true;
        }
        totalBalance += msg.value;
    }

    function sendTo(address payable _to, uint amount) public payable onlyOwner{
        require(amount < totalBalance, "There is no such amount of coins");
        _to.transfer(amount);
        totalBalance -= amount;
    }

    function getBenefactors() public view returns (address[] memory) {
        return benefactors;
    }

    function getTotalDonatsOf(address beneractor) public view returns(uint) {
        require(havingBenefactors[beneractor], "This address didn't make donats");
        return benefactorsToAmount[beneractor];
    }
}