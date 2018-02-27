import Role from "./role/role.enum";
import BaseRole from "./role/base";
import Miner from "./role/miner";
import Fixer from "./role/fixer";
import Builder from "./role/builder";
import Transporter from "./role/transporter";
import Guardian from "./role/guardian";
import Claimer from "./role/claimer";
import Upgrader from "./role/upgrader";
import { CreepMemoryC, RoomMemoryC, SpawnMemoryC, } from "./memory";



class CreepManager {

  static run() {
    for(let room in Memory.rooms){
      if((<RoomMemoryC>Memory.rooms[room]).roles == null) {
        (<RoomMemoryC>Memory.rooms[room]).roles = {
          0: {
            available: 0,
            desired: 1
          },
          1: {
            available: 0,
            desired: 1
          },
          2: {
            available: 0,
            desired: 1
          },
          3: {
            available: 0,
            desired: 1
          },
          4: {
            available: 0,
            desired: 0
          },
          5: {
            available: 0,
            desired: 0
          },
          6: {
            available: 0,
            desired: 0
          }

        };
      }
    }

    this.checkIfCreepsNeedToBeSpawend();

    for(let name in Game.creeps) {
      let creep = Game.creeps[name];
      let memory = <Memory>creep.memory;
      switch(memory.role) {
        case Role.Miner:
          Miner.run(creep);
          break;
        case Role.Fixer:
          Fixer.run(creep);
          break;
        case Role.Transporter:
          Transporter.run(creep);
          break;
        case Role.Builder:
          Builder.run(creep);
          break;
        case Role.Guardian:
          Guardian.run(creep);
          break;
        case Role.Claimer:
          Claimer.run(creep);
          break;
        case Role.Upgrader:
          Upgrader.run(creep);
          break;
      }
    }
  }

  static checkIfCreepsNeedToBeSpawend() {
    for(let spawnName in Game.spawns) {
      let spawn = Game.spawns[spawnName];
      let roomMemory =  <RoomMemoryC>spawn.room.memory;
      if(roomMemory.hostiles.length > 0) {
        if(roomMemory.roles[Role.Guardian].available < roomMemory.roles[Role.Guardian].desired) {
          this.spawn(spawn, Role.Guardian);
        }
        if(roomMemory.roles[Role.Transporter].available > 0) return;
      }

      if(roomMemory.roles[Role.Miner].available < roomMemory.roles[Role.Miner].desired) {
        this.spawn(spawn, Role.Miner);
      }
      else if(roomMemory.roles[Role.Fixer].available < roomMemory.roles[Role.Fixer].desired) {
        this.spawn(spawn, Role.Fixer);
      }
      else if(roomMemory.roles[Role.Transporter].available < roomMemory.roles[Role.Transporter].desired) {
        this.spawn(spawn, Role.Transporter);
      }
      else if(roomMemory.roles[Role.Builder].available < roomMemory.roles[Role.Builder].desired){
        this.spawn(spawn, Role.Builder);
      }
      else if(roomMemory.roles[Role.Upgrader].available < roomMemory.roles[Role.Upgrader].desired){
        this.spawn(spawn, Role.Upgrader);
      }
      else if(roomMemory.claimRoom != undefined) {
        if(this.spawn(spawn, Role.Claimer, {targetRoom: roomMemory.claimRoom}) == OK) {
          delete roomMemory.claimRoom;
        }
      }
    }
  }

  static spawn(spawn: StructureSpawn, role: Role, aditionalMemory: any = {}) {
    // Game.spawns.Tokyo.createCreep(bodyparts, undefined, memory);
    let bodyparts: Array<any> = [];
    let memory = {};

    switch(role) {
      case Role.Miner:
        bodyparts = Miner.bodyparts;
        memory = Miner.initialMemory;
        break;
      case Role.Fixer:
        bodyparts = Fixer.bodyparts;
        memory = Fixer.initialMemory;
        break;
      case Role.Transporter:
        bodyparts = Transporter.bodyparts;
        memory = Transporter.initialMemory;
        break;
      case Role.Builder:
        bodyparts = Builder.bodyparts;
        memory = Builder.initialMemory;
        break;
      case Role.Guardian:
        bodyparts = Guardian.bodyparts;
        memory = Guardian.initialMemory
        break;
      case Role.Upgrader:
        bodyparts = Upgrader.bodyparts;
        memory = Upgrader.initialMemory
        break;
      case Role.Claimer:
        bodyparts = Claimer.bodyparts;
        memory = Claimer.initialMemory
        break;
    }

    let roomMemory =  <RoomMemoryC>spawn.room.memory;
    let result;
    for(let level = bodyparts.length; level >= 0; level--) {
      let name = `${Role[role]} ${level} ${Date.now()}`;

      if(spawn.spawnCreep(bodyparts[level], name, {memory: memory, dryRun: true}) == ERR_NOT_ENOUGH_ENERGY) {
        console.log("not enouth energy");
        continue;
      }
      result = spawn.spawnCreep(bodyparts[level], name, {memory: { ...memory, ...aditionalMemory }} );
      if( result == OK) {
        roomMemory.roles[role].available++;
        return result;
      }
    }
    return result;
  }
}


export default CreepManager;
