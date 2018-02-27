import Role from "./role.enum";
import BaseRole from "./base";

class Coloniser extends BaseRole {

  static bodyparts = [
    [WORK,CARRY,MOVE],
    [WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
  ];

  static initialMemory = {
    ...Coloniser.baseMemory,
    role: Role.Coloniser,
    state: 0
    targetRoom: null
  };

  static run(creep: any) {
    super.run(creep);

    switch(creep.memory.state) {
      case Coloniser.State.Traveling:
        let targets = Game.rooms[creep.memory.targetRoom].find(FIND_SOURCES);

        if (creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Coloniser.State.Building;
        }
        break;

      case Coloniser.State.Mining:

        targets = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (object: any) => {
          return object.resourceType == RESOURCE_ENERGY;
        }});

        if(targets.length > 0) {
          if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Coloniser.State.Building;
        }

        break;

      case Coloniser.State.Building:

        if (creep.room.controller.ticksToDowngrade < 15000 || creep.room.controller.level < 1) {
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
    Traveling,
    Mining,
      Building,
  }
}

export default Coloniser;
