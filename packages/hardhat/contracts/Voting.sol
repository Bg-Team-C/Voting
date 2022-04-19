pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT


contract Voting {

  struct Student {
    bool authorized;
    bool voted;
    uint256 vote;
  }

  // To check if election is active or not
  bool public isActive = false;
  bool public isEnded = false;

  // Storing address of those who completed the voting process
  mapping(address => bool) public voters;


  // Voting Process
  function vote(uint256 voteInex)
    public
    electionIsStillOn
    electionIsActive
  {
    //Check if voter is authorized and has not already voted
    require(!voters[msg.sender].voted);
    require(voters[msg.sender].authorized);

    //record vote
    voters[msg.sender].vote = voteIndex;
    voters[msg.sender].voted = true;

    //increase candidate vote count by 1
    candidates[voteIndex].voteCount += 1;
  }

}