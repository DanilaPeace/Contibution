const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("dotenv").config();
require("./tasks");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_PRIVATE_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
