import Role from "./role.enum";
import BaseRole from "./base";

class Transporter extends BaseRole {

  static bodyparts = [
    [CARRY,CARRY,MOVE],
    [CARRY,CARRY,MOVE,MOVE],
    [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
  ];

  static initialMemory = {
    ...Transporter.baseMemory,
    role: Role.Transporter,
    state: 0
  };

  static run(creep: any) {
    super.run(creep);
    let targets;
    let memory = <Memory>creep.memory;
    switch(creep.memory.state) {
      case Transporter.State.Collecting:

        targets = creep.room.find(FIND_STRUCTURES, {
          filter: function(object: any) {
            return object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] > creep.carryCapacity;
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
          else {
              targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(object: any) {
                  return object.structureType == STRUCTURE_STORAGE && object.store[RESOURCE_ENERGY] < object.storeCapacity;
                }
              });

              if(targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[0]);
                }
              }
          }
        }

        if(creep.carry.energy >= creep.carryCapacity) {
          creep.memory.state = Transporter.State.Depositing;
        }

        break;
      case Transporter.State.Depositing:


        targets = creep.room.find(FIND_STRUCTURES, {
          filter: function(object: any) {
            return object.structureType == STRUCTURE_EXTENSION && object.energy < object.energyCapacity;
          }
        });

        if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
        else {
          targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object: any) {
              return object.structureType == STRUCTURE_SPAWN && object.energy < object.energyCapacity;
            }
          });

          if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
          }
          else {
            targets = creep.room.find(FIND_STRUCTURES, {
              filter: function(object: any) {
                return object.structureType == STRUCTURE_TOWER && object.energy < object.energyCapacity;
              }
            });

            if(targets.length > 0) {
              if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
              }
            }
            else {
              targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(object: any) {
                  return object.structureType == STRUCTURE_STORAGE && object.store[RESOURCE_ENERGY] < object.storeCapacity;
                }
              });

              if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[0]);
                }
              }
              else {
                if(creep.transfer(Game.spawns.Tokyo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && Game.spawns.Tokyo.energy < Game.spawns.Tokyo.energyCapacity) {
                  creep.moveTo(Game.spawns.Tokyo);
                }
              }
            }
          }
        }

        if(creep.carry.energy <= 0) {
          creep.memory.state = Transporter.State.Collecting;
        }

        break;
    }
  }
}

module Transporter  {
  export enum State {
    Collecting,
      Depositing,
  }
}

export default Transporter;
