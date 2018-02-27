import Role from "./role.enum";
import BaseRole from "./base";
import { CreepMemoryC, RoomMemoryC } from "../memory";

class Guardian extends BaseRole {

  //1300
  static bodyparts = [
    [ATTACK,ATTACK,ATTACK,ATTACK, //280
      MOVE,MOVE,MOVE,MOVE, //200
      TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, //80
    ], //780
    [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, //480
      MOVE,MOVE,MOVE,MOVE, //200
      TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, //100
    ] //780
  ];

  static initialMemory = {
    role: Role.Guardian,
    state: 0
  }

  static run(creep: any) {
    super.run(creep);

    let memory = <CreepMemoryC>creep.memory;
    switch(memory.state) {
      case Guardian.State.Attackin:

        let targets = (<RoomMemoryC>Memory.rooms[creep.room.name]).hostiles;

        if(targets.length > 0) {
          if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }

        break;
    }
  }
}

module Guardian  {
  export enum State {
    Attackin,
  }
}

export default Guardian;
