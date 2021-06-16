pragma solidity ^0.5.0;

import "solidity-string-utils/StringUtils.sol";

contract User {
  uint public userCount = 0;

  struct User {
    uint id;
    string name;
    string password;
  }

  

  mapping(uint => User) public users;




  event UserCreated(
    uint id,
    string name,
    string password
  );

  constructor() public {
    createUser("admin","admin");
    createUser("asd","asd");
  }

  function createUser(string memory _name, string memory _password) public {
    userCount++;
    users[userCount] = User(userCount,_name, _password);
    emit UserCreated(userCount, _name, _password);
  }

   function loginUser(string memory _name, string memory _password) public returns(bool) {
    
    bool _in = false;
    for (uint i=0; i<userCount ; i++) {
        if(compareStrings(users[i].name,_name) && compareStrings(users[i].password,_password)){
            _in = true;
            
        }
    }
    return _in;
   
  }

  function compareStrings(string memory a, string memory b) public view returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
}


  

}
