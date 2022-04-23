const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const school = await ethers.getContract("School", deployer);

  console.log("\n 🏵  Deploying Voting ...\n");

  // Deploy the Voting
  await deploy("Voting", {
    from: deployer,
    args: [school.address],
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  const nxt = await ethers.getContract("Voting", deployer);

};

module.exports.tags = ["Voting"];