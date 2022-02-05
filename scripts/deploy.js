const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    const ContributionFactory = await ethers.getContractFactory("Contribution");
    const contribution = await ContributionFactory.deploy();
    await contribution.deployed();

    console.log("Contribution address: ", contribution.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
