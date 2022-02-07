const { task } = require("hardhat/config");
const { getBalance, getContribution, makeDonatToFrom } = require("../utils/index");
const Contribution = require("../artifacts/contracts/Conrtibution.sol/Contribution.json");

task("make-donat", "Make donat to address")
  .addParam("address", "To this address you send coins")
  .addParam("amount", "Amount of coins you want to send")
  .setAction(async ({ address, amount }) => {
    const [signer] = await ethers.getSigners();
    const contribution = new ethers.Contract(address, Contribution.abi);
    await contribution
      .connect(signer)
      .makeDonat({ value: ethers.utils.parseEther(amount.toString()) });
    console.log(`You sent ${amount} (coin|s) to the ${address}`);
    console.log(
      `Contribution with address ${address} has balance ${await getBalance(
        address
      )}`
    );
  });

task("send", "Send some amount of coins to address")
  .addParam("senderAddress", "Sender address")
  .addParam("receiverAddress", "Receiver address")
  .addParam("amount", "Amount of coins you want to send")
  .setAction(async ({ senderAddress, receiverAddress, amount }) => {
    senderAddress = await ethers.utils.getAddress(senderAddress);
    const [acc1] = await ethers.getSigners();
    const contribution = await getContribution();
    const contractOwner = await contribution.owner();

    if (contractOwner !== senderAddress) {
      console.log("Only owner can send coins");
      return;
    }
    await makeDonatToFrom(contribution, acc1, 2);
    await contribution.sendTo(
      receiverAddress,
      ethers.utils.parseEther(amount.toString())
    );

    console.log(
      `Sender with address ${senderAddress} sended ${amount} coin|s to ${receiverAddress}`
    );
  });

task("benefactors", "Get list of the all benefactors", async (taskArgs) => {
  const contributionFactory = await ethers.getContractFactory("Contribution");
  const contribution = await contributionFactory.deploy();
  await contribution.deployed();

  console.log(await contribution.getBenefactors());
});

task("donats-of", "Get the donats of address")
  .addParam("address", "Benefactor's address")
  .setAction(async ({ address }) => {
    const contributionFactory = await ethers.getContractFactory("Contribution");
    const contribution = await contributionFactory.deploy();
    await contribution.deployed();

    const totalDonatsSum = await contribution.getTotalDonatsOf(address);
    console.log(
      `Benefactor with address ${address} made ${ethers.utils.formatEther(
        totalDonatsSum
      )} coin`
    );
  });
