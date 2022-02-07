const getBalance = async (address) => {
  const rawBalance = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(rawBalance);
};

const getContribution = async () => {
  const contributionFactory = await ethers.getContractFactory("Contribution");
  const contribution = await contributionFactory.deploy();
  await contribution.deployed();

  return contribution;
};

async function printBalanceOf(address, msg = "") {
  const balance = await getBalance();
  console.log(balance);
}

const makeDonatToFrom = async (to, from, amount) => {
  await to
    .connect(from)
    .makeDonat({ value: ethers.utils.parseEther(amount.toString()) });
};

module.exports = {
  getBalance,
  getContribution,
  printBalanceOf,
  makeDonatToFrom,
};
