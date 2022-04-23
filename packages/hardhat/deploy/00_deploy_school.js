module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log("\n 🏵  Deploying School...\n");

  await deploy("School", {
    from: deployer,
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  const school = await ethers.getContract("School", deployer);
};

module.exports.tags = ["School"];