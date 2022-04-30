const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const keccak256 = require("keccak256");

use(solidity);

describe("Election", function () {
  let voting;
  let school;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Voting", function () {
    it("Should deploy Voting", async function () {
      const School = await ethers.getContractFactory("School")
      const school = await School.deploy("0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E");

      const Voting = await ethers.getContractFactory("Voting");
      const voting = await Voting.deploy(school.address);

      // console.log("Election Contract Address is...\n", voting.address);
    });
  });

  describe("Vote for Candidates Election", function () {
    let deployer;
    let school;
    let voting;
    let stakeholders;

    before(async function() {
      const [owner] = await ethers.getSigners()
      deployer = owner

      const School = await ethers.getContractFactory("School")
      school = await School.deploy(deployer.address);

      const Voting = await ethers.getContractFactory("Voting");
      voting = await Voting.deploy(school.address);
    })

    it("Should not be able to add stakeholders", async function() {
      const School = await ethers.getContractFactory("School")
      const schoolContract = await School.deploy("0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E");

      await expect(schoolContract.addStakeholder("0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931", "Kingsley Holyhill", "Chairman")).to.be.revertedWith("You are not an Admin")
    })

    it("Should add stakeholder", async function() {
      await school.addStakeholder("0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931", "Kingsley Holyhill", "Chairman")
      stakeholders = await school.getStakeholders()
      expect(stakeholders.length).equal(3)
      expect(stakeholders[0].length).equal(1)
      expect(stakeholders[1].length).equal(1)
      expect(stakeholders[2].length).equal(1)
    })

    it("Should add stakeholders", async function() {
      await school.addStakeholders(
        ["0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931", "0x449266b65783538bc1A4fFC1C1583d1A0F92048e"], 
        ["John Doe", "Doe John"], 
        ["Teacher", "Student"])
      stakeholders = await school.getStakeholders()
      expect(stakeholders.length).equal(3)
      expect(stakeholders[0].length).equal(3)
      expect(stakeholders[1].length).equal(3)
      expect(stakeholders[2].length).equal(3)
    })

    it("Should not be able to assign role to a stakeholder", async function() {
      const School = await ethers.getContractFactory("School")
      const schoolContract = await School.deploy("0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E");

      await expect(schoolContract.assignRole("0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "Student")).to.be.revertedWith("You are not an Admin")
    })

    it("Should assign role to a stakeholder", async function() {
      await school.assignRole("0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "Student")
      stakeholder = await school.getStakeholder("0x449266b65783538bc1A4fFC1C1583d1A0F92048e")
    })

    it("Should not be able to revoke role from a stakeholder", async function() {
      const School = await ethers.getContractFactory("School")
      const schoolContract = await School.deploy("0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E");

      await expect(schoolContract.revokeRole("0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "Student")).to.be.revertedWith("You are not an Admin")
    })

    it("Should revoke role of a stakeholder", async function() {
      await school.revokeRole("0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "Student")
      stakeholder = await school.getStakeholder("0x449266b65783538bc1A4fFC1C1583d1A0F92048e")
    })

    it("Should not be able to create an election", async function() {
      await expect(voting.addElection(
        ["0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931"], 
        "President")
      ).to.be.revertedWith("You don't have the required privilege")
    })

    // it("Should be able to create an election", async function() {
    //   await voting.connect("0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E").addElection(
    //     ["0x449266b65783538bc1A4fFC1C1583d1A0F92048e", "0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931"], 
    //     "President")
    // })

    // it("Should not be able to vote because he has voted before", async function(){
    //   // await school.addStakeholder("0xc0D483A3e8B01776EB94f55EA15Ea7fF348B0931", "Kingsley Holyhill", "Chairman")
    //   stakeholders = await school.getStakeholders()

    //   console.log(stakeholders[0])
    //   console.log(stakeholders[1])
    //   console.log(stakeholders[2])

    //   // const hexProof = getHexProof(keccak256(stakeholders[1].address));               
    //   const hexProof = getHexProof(keccak256(stakeholders[0]));               
    //   await expect(voting.connect(stakeholders[0]).vote(5, hexProof)).to.be.revertedWith("Please check back, the election has not started!");
    // })
    
    // it("Should be able to vote election", async function () {
    //     // const owner = stakeholders[0];
    //     const prop = ["Senior Prefect", "To Elect the next Senior Prefect"]
    //     await contract.connect(owner).addElection(prop);
    //     await contract.connect(stakeholders[0]).startElection();
    //     const hexProof = getHexProof(keccak256(stakeholders[3].address));               
    //     const vote = await contract.connect(stakeholders[3]).vote(1, hexProof);
    //     const voted = await vote.wait();
    //     expect(voted.status).to.be.equal(1);
    // });
  
    // it("Should be able to return candidates", async function(){
    //     const candidates = await contract.connect(stakeholders[0]).getCandidates();
    //     expect(candidates.length).to.be.equal(2);
    // })

    // it("Should not be able to vote if wrong proof", async function(){
    //     console.log(stakeholders.length);
    //     const hexProof = getHexProof(keccak256(stakeholders[8].address));               
    //     await expect(contract.connect(stakeholders[8]).vote(1, hexProof)).to.be.revertedWith("sorry, only stakeholders are eligible to vote");
    // })

    // it("Should not be able to vote if wrong candidate ID", async function(){
    //     console.log(stakeholders.length);
    //     const hexProof = getHexProof(keccak256(stakeholders[1].address));               
    //     await expect(contract.connect(stakeholders[1]).vote(5, hexProof)).to.be.revertedWith("Invalid candidate to Vote!");
    // }) 

    // it("Can't Make Result public until end of election", async function(){
    //     console.log(stakeholders.length);
    //     const hexProof = getHexProof(keccak256(stakeholders[0].address));               
    //     await expect(contract.connect(stakeholders[0]).makeResultPublic()).to.be.revertedWith("Sorry, the Election has not ended");
    // })

    // it("Should not be able to vote because election ended", async function(){
    //     console.log(stakeholders.length);
    //     await contract.connect(stakeholders[0]).endElection();
    //     const hexProof = getHexProof(keccak256(stakeholders[1].address));               
    //     await expect(contract.connect(stakeholders[1]).vote(5, hexProof)).to.be.revertedWith("Sorry, the Election has ended!");
    // })

    // it("No access to make the Result public", async function(){
    //     console.log(stakeholders.length);              
    //     await expect(contract.connect(stakeholders[3]).makeResultPublic()).to.be.revertedWith("only teachers/chairman can make results public");
    // })

    // it("Can Make Result public ", async function(){
    //     console.log(stakeholders.length);              
    //     const makePublic = await contract.connect(stakeholders[0]).makeResultPublic();
    //     const madePublic = await makePublic.wait();
    //     expect(madePublic.status).to.be.equal(1);
    // })


    // it("Only chairman should be able to close election", async function(){
    //     await expect(contract.connect(stakeholders[3]).closeElection()).to.be.revertedWith("only chairman can call this function");
    // })

    // it("Chairman Should be able to close election", async function(){
    //     console.log(stakeholders.length);              
    //     const makePublic = await contract.connect(stakeholders[0]).closeElection();
    //     const madePublic = await makePublic.wait();
    //     expect(madePublic.status).to.be.equal(1);
    // })

  });


  // describe("Check Functions", function () {

  //   it("checks if election has started", async function(){
  //       const isStart = await contract.connect(stakeholders[0]).isStarted();
  //       expect(isStart).to.be.equal(false);
  //   })

  //   it("checks if election has ended", async function(){
  //       const isEnd = await contract.connect(stakeholders[0]).isEnded();
  //       expect(isEnd).to.be.equal(false);
  //   })

  //   it("Confirms it is chairman", async function(){
  //       const isChairman = await contract.connect(stakeholders[0]).isChairman();
  //       expect(isChairman).to.be.equal(true);
  //   })

  //   it("Confirms it is teacher", async function(){
  //       await contract.connect(stakeholders[0]).addTeacher(stakeholders[1].address);
  //       const isTeacher = await contract.connect(stakeholders[1]).isTeacher();
  //       expect(isTeacher).to.be.equal(true);
  //   })
    
  // });
});
