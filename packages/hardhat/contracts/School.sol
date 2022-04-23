//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract School {
  bytes32 constant TEACHER_ROLE = keccak256("Teacher");
  bytes32 constant CHAIRMAN_ROLE = keccak256("Chairman");
  bytes32 constant STUDENT_ROLE = keccak256("Student");
  bytes32 constant ADMIN_ROLE = keccak256("Admin");  
  bytes32 constant BOARD_MEMBER_ROLE = keccak256("Board_member");

  uint stakeholdersCount = 1;

  struct Role {
    mapping(address => bool) members;
  }

  struct StakeHolder {
    string name;
    string role;
    address id;
  }

  mapping(bytes32 => Role) private _roles;
  mapping(uint => StakeHolder) private stakeholders;
  mapping(address => uint) private holderMap;

  function addStakeholder(address user, string calldata name, string calldata role) public {
    StakeHolder storage holder = stakeholders[stakeholdersCount];
    holder.id = user;
    holder.name = name;
    holder.role = role;
    assignRole(user, role);
    holderMap[user] = stakeholdersCount;
    stakeholdersCount++;

  }

  function getStakeholders()
  public view
  returns(
    address[] memory,
    string[] memory,
    string[] memory
  )
  {
  string[] memory names = new string[](stakeholdersCount);
  string[] memory roles = new string[](stakeholdersCount);
  address[] memory id = new address[](stakeholdersCount);

  for (uint256 i = 0; i < stakeholdersCount; i++) {
    names[i] = stakeholders[i].name;
    roles[i] = stakeholders[i].role;
    id[i] = stakeholders[i].id;
  }

  return(id, names, roles);
  }


  function getStakeholder(address user)
  public view
  returns(
      address,
      string memory,
      string memory
    )
  {
    uint key = holderMap[user];
    return(stakeholders[key].id, stakeholders[key].name, stakeholders[key].role);
  }  


  function assignRole(address user, string memory role) public {
    _roles[keccak256(abi.encodePacked(role))].members[user] = true;
  }

  function revokeRole(address user, string memory role) public {
    _roles[keccak256(abi.encodePacked(role))].members[user] = false;
  }

  function hasRole(string calldata role) public view returns(bool) {
    return _roles[keccak256(abi.encodePacked(role))].members[msg.sender];
  }



// * MODIFIERS *

  modifier onlyTeacher {
    require(_roles[TEACHER_ROLE].members[msg.sender], "You don't have the required privilege");
    _;
  }

  modifier onlyChairmanOrTeacher {
    require(
    _roles[TEACHER_ROLE].members[msg.sender] ||
    _roles[CHAIRMAN_ROLE].members[msg.sender],
    "You don't have the required privilege"
    );
    _;
  }

}


