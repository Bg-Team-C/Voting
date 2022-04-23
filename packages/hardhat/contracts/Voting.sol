pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import  "./School.sol";

contract Voting {

  School private school;

  constructor(address schoolAddr) {
    school = School(schoolAddr);
  }

  struct Election {
    uint electionId;
    mapping(uint => address) candidates;
    mapping(address => uint)  candidateVote;
    mapping(address => bool) voters;
    string position;
    uint candidateCounter;
    bool isElectionActive;
    bool isElectionEnded;
    uint startBlock;
    uint endBlock;
  }

  mapping(address => bytes32) userRole;
  mapping(uint => Election) public elections;


  uint private electionCounter = 1;

  // Voting Process
  function vote (address _candidateId, uint electionId) public
  electionIsActive(electionId)
  onlyStakeholders
  {
    Election storage election = elections[electionId];
    // To check that voters haven't voted before
    require(!election.voters[msg.sender], "Have already voted");

    // Record the vote
    election.voters[msg.sender] = true;

    // Update candidate vote Count
    election.candidateVote[_candidateId] += 1;
    emit Voted(electionId, msg.sender, _candidateId);
  }
  

  function startElection(uint electionId) public onlyChairman{
    Election storage election = elections[electionId];
    require(!election.isElectionEnded, "This election has Ended");
    election.isElectionActive = true;
    election.startBlock = block.number;
  }

  function stopElection(uint electionId) public onlyChairman{
    Election storage election = elections[electionId];
    election.isElectionActive = false;
    election.isElectionEnded = true;
    election.endBlock = block.number;
  }

  function addElection(address[] calldata candidateList, string calldata position) public
  onlyChairmanOrTeacher 
  {
    Election storage election = elections[electionCounter];
    election.electionId = electionCounter;
    election.candidateCounter = 1;
    election.position = position;
    election.isElectionActive = false;
    election.isElectionEnded = false;
    for (uint256 i = 0; i < candidateList.length; i++) {
      election.candidates[election.candidateCounter] = candidateList[i];
      election.candidateCounter++;
    }

    electionCounter++;
  }

  function collateResult(uint electionId, address[] calldata candidates, uint[] calldata count)
    public
    onlyChairmanOrTeacher
    electionEnded(electionId)
    {
      Election storage election = elections[electionId];

      for (uint256 i = 0; i < candidates.length; i++) {
        election.candidateVote[candidates[i]] = count[i];
      }
  }

  function publishResult(uint electionId)
    public
    view
    onlyChairmanOrTeacher
    electionEnded(electionId)
    returns(
      address[] memory,
      uint[] memory,
      string memory
    )
    {
      Election storage election = elections[electionId];
      address[] memory candidateList = new address[](election.candidateCounter);
      uint[] memory votes = new uint[](election.candidateCounter);

      for (uint256 i = 0; i < election.candidateCounter; i++) {
        candidateList[i] = election.candidates[i];
        votes[i] = election.candidateVote[election.candidates[i]];
      }

      return(candidateList, votes, election.position);
  }


  function getElections()
    public view
    returns(
        uint[] memory,
        address[][] memory,
        string[] memory
      )
    {
      uint[] memory ids = new uint[](electionCounter);
      address[][] memory candidates = new address[][](electionCounter);
      string[] memory positions = new string[](electionCounter);

      for (uint256 i = 0; i < electionCounter; i++) {
        (uint id, address[] memory candidate, string memory position) = getElection(i);
        candidates[i] = candidate;
        positions[i] = position;
        ids[i] = id;
      }

      return(ids, candidates, positions);
  }  

  function getElection(uint electionId)
    public view
    returns(
        uint,
        address[] memory,
        string memory
      )
    {
      Election storage election = elections[electionId];
      address[] memory candidates = new address[](election.candidateCounter);

      for (uint256 i = 0; i < election.candidateCounter; i++) {
       candidates[i] = election.candidates[i];
      }

      return(electionId, candidates, election.position);
  }  


  // * MODIFIERS *

  modifier electionIsActive(uint electionId) {
    Election storage election = elections[electionId];
    require(election.isElectionActive, "Election has not begun!");
    _;
    }


  modifier electionEnded(uint electionId){
    Election storage election = elections[electionId];
    require(!election.isElectionActive, "Election is still ongoing");
    _;
  }

  modifier onlyTeacher {
        require(school.hasRole(string("Teacher")), "You don't have the required privilege");
        _;
  }

  modifier onlyChairman {
        require(school.hasRole(string("Chairman")), "You don't have the required privilege");
        _;
  }

  modifier onlyChairmanOrTeacher {
        require(
        school.hasRole(string("Chairman")) ||
        school.hasRole(string("Teacher")),
        "You don't have the required privilege"
        );
        _;
  }
  
  modifier onlyStakeholders {
        require(
        school.hasRole(string("Chairman")) ||
        school.hasRole(string("Board_member")) ||
        school.hasRole(string("Teacher")) ||
        school.hasRole(string("Student")),
        "You don't have the required privilege"
        );
        _;
  }


  event Voted(uint electionId, address voter, address candidate);

  //* EVENTS & ERRORS *

  ///event to emit when the contract is unpaused
  //event ElectionEnded(uint _electionId, candidates);

  ///event to emit when candidate has been created
  event CandidateCreated(uint _candidateId, string _candidateName);

  /// event to emit when a candidate receives a vote
  event VoteForCandidate(uint _candidateId, uint _candidateVoteCount);


    ///error messages 
    error ElectionNotStarted();
    error ElectionHasEnded();
}
