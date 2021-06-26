pragma solidity ^0.5.0;

contract SideLowe {
  uint public roomCount = 0;
  string public hotelName = "Side Löwe Hotel";


  struct SideLowe{
    uint id;
    string name;
    uint allocation;
  }


  mapping(uint => SideLowe) public rooms;


 


  event RoomCreated(
    uint id,
    string name,
    uint allocation
  );

  event Reserv(
    uint id,
    uint allocation
  );

  constructor() public {
    createRoom("Single Room Löwe",10);
    createRoom("Double Room Löwe",10);

  }



  function createRoom(string memory _content,uint _allocation) public {
    roomCount++;
    rooms[roomCount] = SideLowe(roomCount, _content, _allocation);
    emit RoomCreated(roomCount, _content, _allocation);
  }

  function doReservation(uint room_id) public {
    SideLowe memory _room = rooms[room_id];
    _room.allocation = _room.allocation - 1;
    rooms[room_id] = _room;
    emit Reserv(room_id, _room.allocation);
   
  }



}
