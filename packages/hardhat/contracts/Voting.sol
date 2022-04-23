pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import  "./School.sol";

contract Voting is School{

  mapping(address => bytes32) userRole;
  //candidate id to vote gotten
  mapping(address => uint) private candidateVote;
  mapping(uint => address) public candidates;


  uint private candidateCounter = 1;

  // To check if election is active or not
  bool public isElectionActive = false;
  bool public isEnded = false;

  // Storing address of those who completed the voting process
  mapping(address => bool) public voters;


  // Voting Process
  function vote (address _candidateId) public
  electionIsStillOn
  electionIsActive
  {
    // To check that voters haven't voted before
    require(!voters[msg.sender]);

    // Check candidate is valid
    //require(_candidateId > 0 && _candidateId <= candidateCounter);

    // Record the vote
    voters[msg.sender] = true;

    // Update candidate vote Count
    candidateVote[_candidateId] = candidateVote[_candidateId]++;
  }
  

  function startElection() public {
    isElectionActive = true;
  }

  function stopElection() public {
    isElectionActive = false;
  }

  function setElectionCandidates(address[] calldata candidateList) public 
  {
    //candidateCounter = 1; // should be intailized/reset in start vote 
    for (uint256 i = 0; i < candidateList.length; i++) {
      candidates[candidateCounter] = candidateList[i];
    }
  }

  function collateResult()
    public
    view
    onlyChairmanOrTeacher
    electionEnded
    returns(
      address[] memory,
      uint[] memory
    )
    {
      address[] memory candidateList = new address[](candidateCounter);
      uint[] memory votes = new uint[](candidateCounter);

      for (uint256 i = 0; i < candidateCounter; i++) {
        candidateList[i] = candidates[i];
        votes[i] = candidateVote[candidates[i]];
      }

      return(candidateList, votes);
  }


  function publishResult()
    public
    view
    onlyChairmanOrTeacher
    electionEnded
    returns(
      address[] memory,
      string[] memory,
      uint[] memory
    )
    {
      (address[] memory candidateList, uint[] memory votes) = collateResult();
      string[] memory names = new string[](candidateCounter);

      for (uint256 i = 0; i < candidateList.length; i++) {
        (, string memory name,) = getStakeholder(candidateList[i]);
        names[i] = name;
      }

      return( candidateList, names, votes);
  }

  function getCandidates()
    public view
    returns(
        string[] memory,
        address[] memory
      )
    {
      string[] memory names = new string[](candidateCounter);
      address[] memory addresses = new address[](candidateCounter);

      for (uint256 i = 0; i < candidateCounter; i++) {
       (address user, string memory name,) = getStakeholder(candidates[i]);
       names[i] = name;
       addresses[i] = user;
      }

      return(names, addresses);
  }  

  // * MODIFIERS *

  modifier onlyValidCandidate(uint256 _candidateId) {
    require(
      _candidateId < candidateCounter && _candidateId >= 0,
      "Invalid candidate to Vote!"
    );
    _;
    }

  modifier electionIsStillOn() {
    require(!isEnded, "Election has ended!");
    _;
  }

  modifier electionIsActive() {
    require(isElectionActive, "Election has not begun!");
    _;
    }


  modifier electionEnded(){
    require(!isElectionActive, "Election is still ongoing");
    _;
  }

}
