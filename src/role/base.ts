import Role from "./role.enum";

class Base {
  static baseMemory = {
    init: false,
    room: null
  }

  static run(creep: any) {
    if(!creep.memory.init) {
      this.init(creep);
      creep.memory.init = true;
      creep.memory.room = creep.room.name;
    }
  }

  static init(creep: any) {
  }
}

module Base {
  export enum State {
  }
}

export default Base;

//   static checkIfCreepsNeedToBeSpawend() {
//     for(let spawnName in Game.spawns) {
//       let spawn = Game.spawns[spawnName];
//       let roomMemory =  <RoomMemoryC>spawn.room.memory;
//       if(roomMemory.hostiles.length > 0) {
//         if(roomMemory.roles[Role.Guardian].available < roomMemory.roles[Role.Guardian].desired) {
//           this.spawn(spawn, Guardian);
//         }
//       }
//
//       if(roomMemory.roles[Role.Miner].available < roomMemory.roles[Role.Miner].desired) {
//         this.spawn(spawn, Miner);
//       }
//       else if(roomMemory.roles[Role.Fixer].available < roomMemory.roles[Role.Fixer].desired) {
//         this.spawn(spawn, Fixer);
//       }
//       else if(roomMemory.roles[Role.Transporter].available < roomMemory.roles[Role.Transporter].desired) {
//         this.spawn(spawn, Transporter);
//       }
//       else if(roomMemory.roles[Role.Builder].available < roomMemory.roles[Role.Builder].desired){
//         this.spawn(spawn, Builder);
//       }
//     }
//   }
//
//   static spawn(spawn: StructureSpawn, role: BaseRole) {
//     // Game.spawns.Tokyo.createCreep(bodyparts, undefined, memory);
//
//     let roomMemory =  <RoomMemoryC>spawn.room.memory;
//     for(let level = role.bodyparts.length; level > 0; level--) {
//       let name = `${Role[role]} ${level} ${Date.now()}`;
//
//       if(spawn.spawnCreep(role.bodyparts[level], name, {memory: role.initialMemory, dryRun: true}) == ERR_NOT_ENOUGH_ENERGY) {
//         console.log("not enouth energy");
//         continue;
//       }
//       if(spawn.spawnCreep(role.bodyparts[level], name, {memory: role.initialMemory}) == OK) {
//         roomMemory.roles[role].available++;
//         break;
//       }
//       console.log("did not spawn");
//     }
//   }
// }
