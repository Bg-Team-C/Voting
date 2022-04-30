pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

///@author Team-C project Team
///@title School Leadership Election.
///@notice Only the chairman and teachers can setup and compile the result of the votes.
///@notice Only the chairman can grant access for the vote to happen.
///@dev Contract under development to enable each stakeholder vote.


import  "./School.sol";
import "hardhat/console.sol";

contract Voting {

  School private school;

  constructor(address schoolAddr) {
    school = School(schoolAddr);
  }

    ///@param Candidates Those who needs to be voted for.
    ///@param CandidateVote The vote of each candidates address of the file shared
    ///@param voters Those who vote during the election 
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


  uint private electionCounter = 0;

  ///@notice Voting Process
  function vote(string memory _candidateId, uint electionId) public
  electionIsActive(electionId)
  onlyStakeholders
  {
    Election storage election = elections[electionId];
    // To check that voters haven't voted before
    require(!election.voters[msg.sender], "Have already voted");

    ///@notice Record the vote
    election.voters[msg.sender] = true;

    ///@notice Update candidate vote Count
    // election.candidateVote[_candidateId] += 1;
    emit Voted(electionId, _candidateId);
    console.log(_candidateId);
  }
  
  ///@notice Function to start election

  function startElection(uint electionId) public onlyChairman{
    Election storage election = elections[electionId];
    require(!election.isElectionEnded, "This election has Ended");
    election.isElectionActive = true;
    election.startBlock = block.number;
  }

  ///@notice  Function to  stop  election

  function stopElection(uint electionId) public onlyChairman{
    Election storage election = elections[electionId];
    election.isElectionActive = false;
    election.isElectionEnded = true;
    election.endBlock = block.number;
  }

  function getBlockNumbers(uint electionId) public view returns (uint, uint) {
    Election storage election = elections[electionId];

    return (election.startBlock, election.endBlock);

  }
  ///@notice  Function to  create a new election
  function addElection(address[] calldata candidateList, string calldata position) public
  onlyChairmanOrTeacher 
  {
    Election storage election = elections[electionCounter];
    election.electionId = electionCounter;
    election.candidateCounter = candidateList.length;
    election.position = position;
    election.isElectionActive = false;
    election.isElectionEnded = false;

    for (uint256 i = 0; i < candidateList.length; i++) {
      election.candidates[i] = candidateList[i];
    }

  ///@dev incrementing electionCounter to add to the vote of the candidate
    electionCounter++;
  }

  ///@notice  Function to  collate  result

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

  ///@notice  Function to  view result of   election

  function viewResults(uint electionId)
    public
    view
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


  ///@notice  Function to  get  election

  function getElections()
    public view
    returns(
        uint[] memory,
        address[][] memory,
        string[] memory,
        bool[] memory,
        bool[] memory

      )
    {
      uint[] memory ids = new uint[](electionCounter);
      address[][] memory candidates = new address[][](electionCounter);
      string[] memory positions = new string[](electionCounter);
      bool[] memory isActives = new bool[](electionCounter);
      bool[] memory isEndeds = new bool[](electionCounter);



      for (uint256 i = 0; i < electionCounter; i++) {
        (uint id, address[] memory candidate, string memory position, bool isActive, bool isEnded) = getElection(i);
        candidates[i] = candidate;
        positions[i] = position;
        ids[i] = id;
        isActives[i] = isActive;
        isEndeds[i] = isEnded;

      }

      return(ids, candidates, positions, isActives, isEndeds);
  }  

  function getElection(uint electionId)
    public view
    returns(
        uint,
        address[] memory,
        string memory,
        bool,
        bool
      )
    {
      Election storage election = elections[electionId];
      address[] memory candidates = new address[](election.candidateCounter);

      for (uint256 i = 0; i < election.candidateCounter; i++) {
       candidates[i] = election.candidates[i];
           console.log("Election   candidate >>> ", candidates[i]);

      }

      return(electionId, candidates, election.position, election.isElectionActive, election.isElectionEnded);
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
        require(school.hasRole(string("Teacher"), msg.sender), "You don't have the required privilege");
        _;
  }

  modifier onlyChairman {
        require(school.hasRole(string("Chairman"), msg.sender), "You don't have the required privilege");
        _;
  }

  modifier onlyChairmanOrTeacher {
        require(
        school.hasRole(string("Chairman"), msg.sender) ||
        school.hasRole(string("Teacher"), msg.sender),
        "You don't have the required privilege"
        );
        _;
  }
  
  modifier onlyStakeholders {
        require(
        school.hasRole(string("Chairman"), msg.sender) ||
        school.hasRole(string("Board_member"), msg.sender) ||
        school.hasRole(string("Teacher"), msg.sender) ||
        school.hasRole(string("Student"), msg.sender),
        "You don't have the required privilege"
        );
        _;
  }


  event Voted(uint electionId, string candidate);

  //* EVENTS & ERRORS *

  ///@dev event to emit when vote is carried out
  event Voted(uint indexed electionId, address voter, address candidate);

  ///@dev event to emit when candidate has been created
  event CandidateCreated(uint _candidateId, string _candidateName);

  /// event to emit when a candidate receives a vote
  event VoteForCandidate(uint _candidateId, uint _candidateVoteCount);


    ///error messages 
    error ElectionNotStarted();
    error ElectionHasEnded();
}
