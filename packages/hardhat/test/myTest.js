const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const keccak256 = require('keccak256')

use(solidity);

describe("Election", function () {
  let voting;


  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Voting", function () {
    it("Should deploy Voting", async function () {
      const Voting = await ethers.getContractFactory("Voting");

      voting = await Voting.deploy();
      const School = await ethers.getContractFactory("School")
      school = await School.deploy();

      console.log("Election Contract Address is...\n", voting.address);
    });
  });

  describe("Vote for Candidates Election", function () {

    it("Should not be able to vote because he has voted before", async function(){
      console.log(stakeholders.length);
      const hexProof = getHexProof(keccak256(stakeholders[1].address));               
      await expect(contract.connect(stakeholders[1]).vote(5, hexProof)).to.be.revertedWith("Please check back, the election has not started!");
    })
    
    it("Should be able to vote election", async function () {
        const owner = stakeholders[0];
        const prop = ["Senior Prefect", "To Elect the next Senior Prefect"]
        await contract.connect(owner).addElection(prop);
        await contract.connect(stakeholders[0]).startElection();
        const hexProof = getHexProof(keccak256(stakeholders[3].address));               
        const vote = await contract.connect(stakeholders[3]).vote(1, hexProof);
        const voted = await vote.wait();
        expect(voted.status).to.be.equal(1);
    });
  
    it("Should be able to return candidates", async function(){
        const candidates = await contract.connect(stakeholders[0]).getCandidates();
        expect(candidates.length).to.be.equal(2);
    })

    it("Should not be able to vote if wrong proof", async function(){
        console.log(stakeholders.length);
        const hexProof = getHexProof(keccak256(stakeholders[8].address));               
        await expect(contract.connect(stakeholders[8]).vote(1, hexProof)).to.be.revertedWith("sorry, only stakeholders are eligible to vote");
    })

    it("Should not be able to vote if wrong candidate ID", async function(){
        console.log(stakeholders.length);
        const hexProof = getHexProof(keccak256(stakeholders[1].address));               
        await expect(contract.connect(stakeholders[1]).vote(5, hexProof)).to.be.revertedWith("Invalid candidate to Vote!");
    }) 

    it("Can't Make Result public until end of election", async function(){
        console.log(stakeholders.length);
        const hexProof = getHexProof(keccak256(stakeholders[0].address));               
        await expect(contract.connect(stakeholders[0]).makeResultPublic()).to.be.revertedWith("Sorry, the Election has not ended");
    })

    it("Should not be able to vote because election ended", async function(){
        console.log(stakeholders.length);
        await contract.connect(stakeholders[0]).endElection();
        const hexProof = getHexProof(keccak256(stakeholders[1].address));               
        await expect(contract.connect(stakeholders[1]).vote(5, hexProof)).to.be.revertedWith("Sorry, the Election has ended!");
    })

    it("No access to make the Result public", async function(){
        console.log(stakeholders.length);              
        await expect(contract.connect(stakeholders[3]).makeResultPublic()).to.be.revertedWith("only teachers/chairman can make results public");
    })

    it("Can Make Result public ", async function(){
        console.log(stakeholders.length);              
        const makePublic = await contract.connect(stakeholders[0]).makeResultPublic();
        const madePublic = await makePublic.wait();
        expect(madePublic.status).to.be.equal(1);
    })


    it("Only chairman should be able to close election", async function(){
        await expect(contract.connect(stakeholders[3]).closeElection()).to.be.revertedWith("only chairman can call this function");
    })

    it("Chairman Should be able to close election", async function(){
        console.log(stakeholders.length);              
        const makePublic = await contract.connect(stakeholders[0]).closeElection();
        const madePublic = await makePublic.wait();
        expect(madePublic.status).to.be.equal(1);
    })

  });


  describe("Check Functions", function () {

    it("checks if election has started", async function(){
        const isStart = await contract.connect(stakeholders[0]).isStarted();
        expect(isStart).to.be.equal(false);
    })

    it("checks if election has ended", async function(){
        const isEnd = await contract.connect(stakeholders[0]).isEnded();
        expect(isEnd).to.be.equal(false);
    })

    it("Confirms it is chairman", async function(){
        const isChairman = await contract.connect(stakeholders[0]).isChairman();
        expect(isChairman).to.be.equal(true);
    })

    it("Confirms it is teacher", async function(){
        await contract.connect(stakeholders[0]).addTeacher(stakeholders[1].address);
        const isTeacher = await contract.connect(stakeholders[1]).isTeacher();
        expect(isTeacher).to.be.equal(true);
    })
    
  });
});