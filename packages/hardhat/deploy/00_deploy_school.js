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
  await school.assignRole("0x116db641B7E3fB197098f23aA1EE3b8F11051579", "Admin");
};

module.exports.tags = ["School"];