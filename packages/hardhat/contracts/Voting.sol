pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract Voting {

  struct Student {
    bool authorized;
    bool voted;
    uint256 vote;
  }

  struct Candidate {
    uint candidateId;
    bytes32 name;
    bytes32 position;
  }
  

  bytes32 constant TEACHER_ROLE = keccak256("TEACHER_ACCESS");
  bytes32 constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ACCESS");
  bytes32 constant STUDENT_ROLE = keccak256("STUDENT_ACCESS");

  mapping(address => bytes32) userRole;
  //candidate id to vote gotten
  mapping(uint => uint) private votesObtained;
  mapping(uint => Candidate) public candidates;


  uint private candidateCounter;

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

  function setElectionCandidates(string[] memory names, string[] memory position) public 
  onlyTeacher(msg.sender)
  {
    candidateCounter = 1; // should be intailized/reset in start vote 
    for (uint256 i = 0; i < names.length; i++) {
      Candidate storage candidate = candidates[candidateCounter];
      candidate.candidateId = candidateCounter;
      candidate.name = names[i];
      candidate.position = position[i];
      candidateCounter++;
    }
  }


  function publishResult()
    public
    onlyChairmanOrTeacher
    electionEnded
    returns(
      string[],
      string[],
      uint[]
    )
    {
      string[] names = new string[](candidateCounter);
      string[] positions = new string[](candidateCounter);
      uint[] votes = new uint[](candidateCounter);

      for (uint256 i = 0; i < candidateCounter; i++) {
        names[i] = candidates[i].name;
        positions = candidates[i].position;
        votes = votesObtained[i];
      }

      return(names, positions, votes);
    }

  // * MODIFIERS *

  modifier onlyValidCandidate(uint256 _candidateId) {
    require(
      _candidateId < candidatesCount && _candidateId >= 0,
      "Invalid candidate to Vote!"
    );
    _;
    }

  modifier electionIsStillOn() {
    require(!isEnded, "Election has ended!");
    _;
  }

  modifier electionIsActive() {
    require(isActive, "Election has not begun!");
    _;
    }


  modifier electionEnded(){
    require(isEnded, "Election is still ongoing");
    _;
  }

  modifier onlyTeacher(address user) {
    require(userRole[user] == TEACHER_ROLE, "You don't have the required privilege");
    _;
  }

  modifier onlyChairmanOrTeacher (address user) {
    require(
      userRole[user] == TEACHER_ROLE ||
      userRole[user] == CHAIRMAN_ROLE ||
      "You don't have the required privilege"
    );
    _;
  }

}
