const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();


  await deploy("Voting", {
    from: deployer,
    log: true,
  });
  
  const voting = await ethers.getContract("Voting", deployer);

  
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["AlphaShare"];
