//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// school contract for stakeholders
contract School {
    uint stakeholdersCount = 1;

// to save the role of each stakeholder
  struct Role {
    mapping(address => bool) members;
  }

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

// to call a stakeholder
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


// stakeholder address
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

  // owner confirms role

  function hasRole(string memory role) public view returns(bool) {
  return _roles[keccak256(abi.encodePacked(role))].members[msg.sender];
}

  modifier onlyAdmin {
    require(hasRole(string("Admin")), "You are not an Admin");
    _;
  }

}
