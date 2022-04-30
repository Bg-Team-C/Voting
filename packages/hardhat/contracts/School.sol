//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

///@author Team-C project Team
///@title School Leadership Election

// school contract for stakeholders
contract School {
    uint stakeholdersCount = 0;

// to save the role of each stakeholder
  struct Role {
    mapping(address => bool) members;
  }

    ///@param Name The name of the stakeholder
    ///@param role e.g chairman, teacher, etc.
    ///@param id The address of user

  struct StakeHolder {
    string name;
    string role;
    address id;
  }

// addresses for stakeholders
  mapping(bytes32 => Role) private _roles;
  mapping(uint => StakeHolder) private stakeholders;
  mapping(address => uint) private holderMap;

  constructor(){
    _roles[keccak256(abi.encodePacked("Admin"))].members[msg.sender] = true;
  }

// description of stakeholders
  function addStakeholder(address user, string calldata name, string calldata role) public onlyAdmin {
    StakeHolder storage holder = stakeholders[stakeholdersCount];
    holder.id = user;
    holder.name = name;
    holder.role = role;
    assignRole(user, role);
    holderMap[user] = stakeholdersCount;
    stakeholdersCount++;

  }

// add stakeholders and assign roles
  function addStakeholders(address[] memory users, string[] calldata names, string[] calldata roles) 
    public {
      for (uint256 i = 0; i < users.length; i++) {
        addStakeholder(users[i], names[i], roles[i]);
      }
  }

// call stakeholders
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



// owner asigns role
  function assignRole(address user, string memory role) public onlyAdmin {
      _roles[keccak256(abi.encodePacked(role))].members[user] = true;
  }

  // owner revokes role

  function revokeRole(address user, string memory role) public onlyAdmin {
      _roles[keccak256(abi.encodePacked(role))].members[user] = false;
  }

  function hasRole(string memory role, address user) public view returns(bool) {
    return _roles[keccak256(abi.encodePacked(role))].members[user];
      }

  function checkRole(string memory role) public view returns(bool) {
    return _roles[keccak256(abi.encodePacked(role))].members[msg.sender];
      }

// * M O D I F I E R S *

  modifier onlyAdmin {
    require(hasRole(string("Admin"), msg.sender), "You are not an Admin");
    _;
  }

}
