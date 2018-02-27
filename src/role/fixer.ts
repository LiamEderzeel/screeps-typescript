import Role from "./role.enum";
import BaseRole from "./base";

class Fixer extends BaseRole {

  static bodyparts = [
    [WORK,CARRY,MOVE],
    [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
  ]


  static initialMemory = {
    role: Role.Fixer,
    state: 0
  }

  static run(creep: any) {
    super.run(creep);

    let targets;
    switch(creep.memory.state) {
      case Fixer.State.Mining:

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
        else {
          targets = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (object: any) => {
            return object.resourceType == RESOURCE_ENERGY;
          }});

          if(targets.length > 0) {
            if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
          }
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Fixer.State.Fixing;
        }

        break;
      case Fixer.State.Fixing:

        targets = creep.room.find(FIND_STRUCTURES, {
          filter: function(object: any) {
            return (object.structureType == STRUCTURE_CONTAINER && object.hits <= object.hitsMax * .8);
          }
        });

        if(targets.length > 0) {
          if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
        else {

          let targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object: any) {
              return (object.structureType == STRUCTURE_ROAD && object.hits <= object.hitsMax * .8);
            }
          });

          if(targets.length > 0) {
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
          }
          else {
            let targets = creep.room.find(FIND_STRUCTURES, {
              filter: function(object: any) {
                return ((object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART) && object.hits <= object.hitsMax * 0.000005);
              }
            });

            if(targets.length > 0) {
              if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
              }
            }
            else {
              if (creep.room.controller.ticksToDowngrade < 15000 || creep.room.controller.level < 2) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                  creep.moveTo(creep.room.controller);
                }
              } else {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                  if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                  }
                }
                else {
                  if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                      creep.moveTo(creep.room.controller);
                    }
                  }
                }
              }
            }
          }
        }

        if(creep.carry.energy <= 0) {
          creep.memory.state = Fixer.State.Mining;
        }
        break;
    }
  }
}

module Fixer  {
  export enum State {
    Mining,
      Fixing,
  }
}

export default Fixer;
