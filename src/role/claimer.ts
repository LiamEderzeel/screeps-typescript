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
      case Claimer.State.Claiming:
        if (creep.claimController(Game.rooms[creep.memory.targetRoom].controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.rooms[creep.memory.targetRoom].controller);
        }
        break;
    }
  }

  static init(creep: any) {
    super.init(creep);
  }
}

module Claimer {
  export enum State {
      Claiming
  }
}

export default Claimer;
