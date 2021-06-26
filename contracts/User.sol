pragma solidity ^0.5.0;

import "solidity-string-utils/StringUtils.sol";

contract User {
  uint public userCount = 0;
  uint public reservationCount = 0;


  struct User {
    uint id;
    string name;
    string password;
  }

   struct Reservation{
    uint id;
    string hotelName;
    string roomName;
  }

  

  mapping(uint => User) public users;
  mapping(uint => Reservation) public reservations;



  event UserCreated(
    uint id,
    string name,
    string password
  );


  event ReservationSaved(
    uint id,
    string hotelName,
    string roomName
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

  function saveReservation(string memory hotelName, string memory roomName) public {
    reservationCount++;
    reservations[reservationCount] = Reservation(reservationCount,hotelName, roomName);
    emit ReservationSaved(reservationCount, hotelName, roomName);
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
