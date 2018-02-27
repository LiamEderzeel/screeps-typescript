import Role from "./role.enum";
import BaseRole from "./base";

class Coloniser extends BaseRole {

  static bodyparts = [
    [WORK,CARRY,MOVE],
    [WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
  ];

  static initialMemory = {
    role: Role.Coloniser,
    state: 0
  };

  static run(creep: any) {
    super.run(creep);

    switch(creep.memory.state) {
      case Coloniser.State.Mining:

        let targets = creep.room.find(FIND_STRUCTURES, {
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
          if(creep.withdraw(Game.spawns.Tokyo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && Memory.roles[Role.Miner].available == Memory.roles[Role.Miner].desired)
            creep.moveTo(Game.spawns.Tokyo);
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Coloniser.State.Building;
        }

        break;
      case Coloniser.State.Building:

        // let targets = creep.room.find(FIND_STRUCTURES, {
        //   filter: function(object: any) {
        //     return object.structureType == STRUCTURE_CONTAINER && object.hits >= object.hitsMax * .8;
        //   }
        // });

        if (creep.room.controller.ticksToDowngrade < 15000 || creep.room.controller.level < 2) {
          if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller);
          }
        }
        else {
          let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
          if(targets.length > 0) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
          }
          else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
              creep.moveTo(creep.room.controller);
            }
          }
        }

        if(creep.carry.energy <= 0) {
          creep.memory.state = Coloniser.State.Mining;
        }
        break;
    }
  }
}

module Coloniser  {
  export enum State {
    Mining,
      Building,
  }
}

export default Coloniser;
