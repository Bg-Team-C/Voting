pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract Voting {

  struct Candidate {
    uint candidateId;
    string name;
    string position;
  }

  bytes32 constant TEACHER_ROLE = keccak256("TEACHER_ACCESS");
  bytes32 constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ACCESS");
  bytes32 constant STUDENT_ROLE = keccak256("STUDENT_ACCESS");
  bytes32 constant  ADMIN_ROLE = keccak256("STUDENT_ACCESS");  

  mapping(address => bytes32) userRole;
  //candidate id to vote gotten
  mapping(uint => uint) private votesObtained;
  mapping(uint => Candidate) public candidates;


  uint private candidateCounter = 1;

  // To check if election is active or not
  bool public isActive = false;
  bool public isEnded = false;

  // Storing address of those who completed the voting process
  mapping(address => bool) public voters;


  // Voting Process
  function vote (uint _candidateId) public
  electionIsStillOn
  electionIsActive
  {
    // To check that voters haven't voted before
    require(!voters[msg.sender]);

    // Check candidate is valid
    require(_candidateId > 0 && _candidateId <= candidateCounter);

    // Record the vote
    voters[msg.sender] = true;

    // Update candidate vote Count
    votesObtained[_candidateId] = votesObtained[_candidateId]++;
  }

  function setElectionCandidates(string[] memory names, string[] memory position) public 
  {
    //candidateCounter = 1; // should be intailized/reset in start vote 
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
    view
    onlyChairmanOrTeacher
    electionEnded
    returns(
      string[] memory,
      string[] memory,
      uint[] memory
    )
    {
      string[] memory names = new string[](candidateCounter);
      string[] memory positions = new string[](candidateCounter);
      uint[] memory votes = new uint[](candidateCounter);

      for (uint256 i = 0; i < candidateCounter; i++) {
        names[i] = candidates[i].name;
        positions[i] = candidates[i].position;
        votes[i] = votesObtained[i];
      }

      return(names, positions, votes);
  }

  function getRole() public view returns(string memory) {
    if(userRole[msg.sender] == TEACHER_ROLE){
      return "Teacher";
    }
     if(userRole[msg.sender] == CHAIRMAN_ROLE){
      return "chairman";
    }
     if(userRole[msg.sender] == STUDENT_ROLE){
      return "student";
    }
     if(userRole[msg.sender] == ADMIN_ROLE){
      return "admin";
    }
    
    return "No role";
  }

  function getCandidates()
    public view
    returns(
        uint[] memory,
        string[] memory,
        string[] memory
      )
    {
      string[] memory names = new string[](candidateCounter);
      string[] memory positions = new string[](candidateCounter);
      uint[] memory id = new uint[](candidateCounter);

      for (uint256 i = 0; i < candidateCounter; i++) {
        names[i] = candidates[i].name;
        positions[i] = candidates[i].position;
        id[i] = candidates[i].candidateId;
      }

      return(id, names, positions);
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
    require(isActive, "Election has not begun!");
    _;
    }


  modifier electionEnded(){
    require(isEnded, "Election is still ongoing");
    _;
  }

  modifier onlyTeacher {
    require(userRole[msg.sender] == TEACHER_ROLE, "You don't have the required privilege");
    _;
  }

  modifier onlyChairmanOrTeacher {
    require(
      userRole[msg.sender] == TEACHER_ROLE ||
      userRole[msg.sender] == CHAIRMAN_ROLE,
      "You don't have the required privilege"
    );
    _;
  }

}
