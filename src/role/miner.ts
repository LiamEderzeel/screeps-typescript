import Role from "./role.enum";
import BaseRole from "./base";
import { CreepMemoryC, RoomMemoryC } from "../memory";

interface MinerMemory extends CreepMemoryC {
  source: string
}

class Miner extends BaseRole {

  static bodyparts = [
    [WORK, MOVE],
    [WORK, WORK, MOVE],
    [WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, MOVE]
  ];

  static initialMemory = {
    ...Miner.baseMemory,
    role: Role.Miner,
    state: 0,
    source: null
  }

  static run(creep: any) {
    super.run(creep);

    let memory = <CreepMemoryC>creep.memory;
    switch (memory.state) {
      case Miner.State.Mining:

        let sources = Game.getObjectById(creep.memory.source);
        if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources);
        }
        if (creep.carry.energy < creep.carryCapacity) {
          creep.memory.state = Miner.State.Depositing;
        }

        break;
      case Miner.State.Depositing:

        let targets = creep.room.find(FIND_STRUCTURES, {
          filter: function (object: any) {
            return object.structureType == STRUCTURE_CONTAINER && object.storeCapacity > object.store.RESOURCE_ENERGY;
          }
        });

        if (targets) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
        else {

          if (creep.transfer(Game.spawns.Tokyo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && Game.spawns.Tokyo.energyCapacity > Game.spawns.Tokyo.energy) {
            creep.moveTo(Game.spawns.Tokyo);
          }

          let targets = creep.room.find(FIND_STRUCTURES, {
            filter: function (object: any) {
              return object.structureType == STRUCTURE_EXTENSION && object.energyCapacity > object.energy;
            }
          });

          targets.push(Game.spawns.Tokyo);

          if (targets) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
          }
        }

        if (creep.carry.energy <= 0) {
          creep.memory.state = Miner.State.Mining;
        }
        break;
    }
  }

  static init(creep: any) {
    super.init(creep);
    if (creep.memory.source == null) {
      let roomMemory = <RoomMemoryC>Memory.rooms[creep.room.name];
      for (let i = 0; i < roomMemory.resources.energy.length; i++) {

        let occupied = false;
        for (let creep in Memory.creeps) {
          if ((<MinerMemory>Memory.creeps[creep]).role != Role.Miner) {
            continue;
          }
          if ((<MinerMemory>Memory.creeps[creep]).source == roomMemory.resources.energy[i]) {
            occupied = true;
          }
        }
        if (!occupied) {
          creep.memory.source = roomMemory.resources.energy[i];
          break;
        }
      }
    }
  }
}

module Miner {
  export enum State {
    Mining,
    Depositing,
  }
}

export default Miner;
