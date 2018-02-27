import Role from "./role.enum";
import BaseRole from "./base";
import { CreepMemoryC, RoomMemoryC } from "../memory";

interface ClaimerMemory extends CreepMemoryC {
  source: string
}

class Claimer extends BaseRole {

  static bodyparts = [
    [CLAIM, MOVE]
  ];

  static initialMemory = {
    ...Claimer.baseMemory,
    role: Role.Claimer,
    state: 0,
    targetRoom: null
  }

  static run(creep: any) {
    super.run(creep);

    let memory = <CreepMemoryC>creep.memory;
    switch (memory.state) {
      case Claimer.State.Traveling:
        let exitDirection = creep.room.findExitTo(creep.memory.targetRoom);
        let exit = creep.pos.findClosestByRange(exitDirection);
        creep.moveTo(exit);


        if(creep.room.name == creep.memory.targetRoom) {
          creep.memory.state = Claimer.State.Claiming;
        }

        break;
      case Claimer.State.Claiming:

        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }

        // if(creep.room != creep.memory.targetRoom) {
        //   creep.memory.state = Claimer.State.Claiming;
        // }
        break;
    }
  }

  static init(creep: any) {
    super.init(creep);
  }
}

module Claimer {
  export enum State {
    Traveling,
      Claiming,
  }
}

export default Claimer;
