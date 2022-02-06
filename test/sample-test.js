const { expect } = require("chai");
const { ethers } = require("hardhat");

async function printBalanceOf(address, msg = "") {
  const rawBalance = await ethers.provider.getBalance(address);
  console.log(await ethers.utils.formatEther(rawBalance));
}

describe("Contribution", () => {
  let ContributionFactory, contribution, owner, acc2, acc3;

  beforeEach(async () => {
    [owner, acc2, acc3] = await ethers.getSigners();
    ContributionFactory = await ethers.getContractFactory("Contribution");
    contribution = await ContributionFactory.deploy();
    await contribution.deployed();
  });

  const callMakeDonatFrom = async (benefactor, amount) => {
    await contribution
      .connect(benefactor)
      .makeDonat({ value: ethers.utils.parseEther(amount.toString()) });
  };

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await contribution.owner()).to.equal(owner.address);
    });
  });

  describe("Checking of the receive and send coins", () => {
    it("Should unique benefactors", async () => {
      await callMakeDonatFrom(acc2, 1);
      await callMakeDonatFrom(acc2, 1);
      expect(await contribution.getBenefactors()).to.eql([acc2.address]);
    });

    it("Should fail if not owner send coins", async () => {
      await callMakeDonatFrom(acc2, 1);
      await expect(
        contribution.connect(acc2).sendTo(acc2.address, 1)
      ).to.be.revertedWith("You are not owner");
    });

    it("Should fail if contribution doen't have enough coins", async () => {
      await callMakeDonatFrom(acc2, 1);
      await expect(
        contribution.sendTo(acc2.address, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("There is no such amount of coins");
    });
  });
});
