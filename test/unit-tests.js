const { expect } = require("chai");
const { ethers } = require("hardhat");
const { makeDonatToFrom } = require("../utils");

describe("Contribution", () => {
  let ContributionFactory, contribution, owner, acc2;

  beforeEach(async () => {
    [owner, acc2] = await ethers.getSigners();
    ContributionFactory = await ethers.getContractFactory("Contribution");
    contribution = await ContributionFactory.deploy();
    await contribution.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await contribution.owner()).to.equal(owner.address);
    });
  });

  describe("Check receiving, sending coins and getting benefactors", () => {
    it("Should unique benefactors", async () => {
      await makeDonatToFrom(contribution, acc2, 1);
      await makeDonatToFrom(contribution, acc2, 1);
      expect(await contribution.getBenefactors()).to.eql([acc2.address]);
    });

    it("Should fail if value <= 0.001", async () => {
      await expect(
        contribution
          .connect(acc2)
          .makeDonat({ value: ethers.utils.parseEther("0.0001") })
      ).to.be.revertedWith("You need send value more then .001 coin");
    });

    it("Should fail if not owner send coins", async () => {
      await makeDonatToFrom(contribution, acc2, 1);
      await expect(
        contribution.connect(acc2).sendTo(acc2.address, 1)
      ).to.be.revertedWith("You are not an owner");

      // Owner send coins
      await contribution.sendTo(acc2.address, 1);
    });

    it("Should fail if contribution doen't have enough coins", async () => {
      await makeDonatToFrom(contribution, acc2, 1);

      await expect(
        contribution.sendTo(acc2.address, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("There is no such amount of coins");
    });

    it("Should be fail if there is no address in benefactor list", async () => {
      await makeDonatToFrom(contribution, owner, 1);

      expect(await contribution.getTotalDonatsOf(owner.address)).to.equal(
        ethers.utils.parseEther("1")
      );

      await expect(
        contribution.getTotalDonatsOf(acc2.address)
      ).to.be.revertedWith("This address didn't make donats");
    });
  });
});
