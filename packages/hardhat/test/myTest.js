const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const keccak256 = require('keccak256')

use(solidity);

describe("Election", function () {
  let voting;
  let 

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before(done) => {
    setTimeout(done, 2000);
  });

  describe("Voting", function () {
    it("Should deploy Voting", async function () {
      const Voting = await ethers.getContractFactory("Voting");

      voting = await Voting.deploy();

      console.log("ZuriElection Contract Address is...\n", voting.address);
    });
  });

 



  });
