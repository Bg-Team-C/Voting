//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract School {
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

  constructor(){
    _roles[keccak256(abi.encodePacked("Admin"))].members[msg.sender] = true;
  }

  function addStakeholder(address user, string calldata name, string calldata role) public onlyAdmin {
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


    function addStakeholders(address[] memory users, string[] calldata names, string[] calldata roles) 
      public {
        for (uint256 i = 0; i < users.length; i++) {
          addStakeholder(users[i], names[i], roles[i]);
        }
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



    function assignRole(address user, string memory role) public onlyAdmin {
        _roles[keccak256(abi.encodePacked(role))].members[user] = true;
    }

    function revokeRole(address user, string memory role) public onlyAdmin {
        _roles[keccak256(abi.encodePacked(role))].members[user] = false;
    }

    function hasRole(string memory role) public view returns(bool) {
    return _roles[keccak256(abi.encodePacked(role))].members[msg.sender];
  }

  modifier onlyAdmin {
    require(hasRole(string("Admin")), "You are not an Admin");
    _;
  }

}
