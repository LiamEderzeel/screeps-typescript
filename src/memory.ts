export interface CreepMemoryC extends CreepMemory  {
  [name: string]: any;
  role: number;
  state: number;
}

export interface RoomMemoryC extends RoomMemory  {
  [name: string]: any;
  hostiles: Array<any>;
  resources: any;
  roles: any;
}

export interface SpawnMemoryC extends SpawnMemory  {
  [name: string]: any;
}

export let RoomMemoryTemplate = {
  roles: {
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
  }
};
