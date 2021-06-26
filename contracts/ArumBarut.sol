pragma solidity ^0.5.0;

contract ArumBarut {
  uint public roomCount = 0;
  string public hotelName = "Arum Barut Collection";


  struct ArumBarut{
    uint id;
    string name;
    uint allocation;
  }


  mapping(uint => ArumBarut) public rooms;


 


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
    createRoom("Single Room Arum",10);
    createRoom("Double Room Arum",10);

  }



  function createRoom(string memory _content,uint _allocation) public {
    roomCount++;
    rooms[roomCount] = ArumBarut(roomCount, _content, _allocation);
    emit RoomCreated(roomCount, _content, _allocation);
  }

  function doReservation(uint room_id) public {
    ArumBarut memory _room = rooms[room_id];
    _room.allocation = _room.allocation - 1;
    rooms[room_id] = _room;
    emit Reserv(room_id, _room.allocation);
   
  }



}
