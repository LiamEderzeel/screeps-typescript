import { ErrorMapper } from "utils/ErrorMapper";
import CreepManager from "./creep-manager";
import { CreepMemoryC, RoomMemoryC } from "./memory";

let room = Game.spawns.Tokyo.room.name;

export const loop = ErrorMapper.wrapLoop(() => {


  (<RoomMemoryC>Memory.rooms[room]).hostiles = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
  // roomStoreSourcesById(room);


  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      let creepMemory = <CreepMemoryC>Memory.creeps[name];
      if (creepMemory.room == undefined){
        throw new Error("Error: creepMemory.room is 'undefined'")
      }
      let roomMemory = <RoomMemoryC>Memory.rooms[creepMemory.room]
      if (creepMemory.role == undefined) {
        throw new Error("Error: creepMemory.role is 'undefined'");
      }
      roomMemory.roles[creepMemory.role].available--;
      delete Memory.creeps[name];
    }
  }

  CreepManager.run();
  defendRoom(Game.spawns.Tokyo.room.name);

});

function defendRoom(roomName: string) {
  let hostiles = (<RoomMemoryC>Memory.rooms[room]).hostiles;
  if (hostiles.length > 0) {
    let username = hostiles[0].owner.username;
    Game.notify(`User ${username} spotted in room ${roomName}`);
    let towers = <Array<StructureTower>>Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
      filter: function (object) {
        return object.structureType == STRUCTURE_TOWER;
      }
    });
    towers.forEach(tower => tower.attack(hostiles[0]));
  }
  else {
  }
};

function roomStoreSourcesById(roomName: string) {
  let sources = Game.rooms[roomName].find(FIND_SOURCES);
  let ids = [];
  for (let i = 0; i < sources.length; i++) {
    ids[i] = sources[i].id;
  }
  (<RoomMemoryC>Memory.rooms[roomName]).resources[RESOURCE_ENERGY] = ids;
}
