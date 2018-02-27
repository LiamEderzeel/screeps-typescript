import Role from "./role.enum";
import BaseRole from "./base";

class Upgrader extends BaseRole {

  static bodyparts = [
    [WORK,CARRY,MOVE],
    [WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
  ];

  static initialMemory = {
    role: Role.Upgrader,
    state: 0
  };

  static run(creep: any) {
    super.run(creep);
let targets;
    switch(creep.memory.state) {
      case Upgrader.State.Withdrawing:

        targets = creep.room.find(FIND_STRUCTURES, {
          filter: function(object: any) {
            return object.structureType == STRUCTURE_STORAGE;
          }
        });

        if(targets.length > 0) {
          if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
        else{
          if(creep.withdraw(Game.spawns.Tokyo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.room.roles[Role.Miner].available == creep.room.roles[Role.Miner].desired)
            creep.moveTo(Game.spawns.Tokyo);
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Upgrader.State.Upgrading;
        }

        break;
      case Upgrader.State.Upgrading:

        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
          creep.moveTo(creep.room.controller);
        }

        if(creep.carry.energy <= 0) {
          creep.memory.state = Upgrader.State.Withdrawing;
        }
        break;
    }
  }

  static init(creep: any) {
    super.init(creep);
  }
}

module Upgrader  {
  export enum State {
    Withdrawing,
      Upgrading,
  }
}

export default Upgrader;
