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
