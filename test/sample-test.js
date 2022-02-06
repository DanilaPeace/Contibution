const { expect, should, assert } = require("chai");
const { ethers } = require("hardhat");
const Contribution = require("../artifacts/contracts/Conrtibution.sol/Contribution.json");

async function getContribution(signer) {
  const contributionContractFactory = await ethers.getContractFactory(
    "Contribution",
    signer
  );
  const contribution = await contributionContractFactory.deploy();
  await contribution.deployed();
  return contribution;
}

describe("Contribution", async function () {
  it("There is no repeating addresses of benefactors in array", async () => {
    const [acc1, acc2, acc3] = await ethers.getSigners();
    const contribution = await getContribution(acc1);
    const contributionContract = await new ethers.Contract(
      contribution.address,
      Contribution.abi,
      acc1
    );

    await contributionContract
      .connect(acc2)
      .makeDonat({ value: ethers.utils.parseEther("1") });
    await contributionContract
      .connect(acc2)
      .makeDonat({ value: ethers.utils.parseEther("1") });
    expect(await contributionContract.getBenefactors()).to.eql([acc2.address]);
  });

  it("Should fail if sender is not an owner", async () => {
    const [acc1, acc2, acc3] = await ethers.getSigners();
    const contribution = await getContribution(acc1);
    const contributionContract = await new ethers.Contract(
      contribution.address,
      Contribution.abi,
      acc1
    );
    await contributionContract
      .connect(acc2)
      .makeDonat({ value: ethers.utils.parseEther("1") });
    
    await expect(
      contributionContract.connect(acc3).sendTo(acc3.address, 1)
    ).to.be.revertedWith("You are not owner");
  });
});
