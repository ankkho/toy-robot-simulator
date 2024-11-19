import { type Direction, type RobotCoordinate } from 'src/robot/types';

export enum ValidCommands {
  MOVE = 'MOVE',
  REPORT = 'REPORT',
  PLACE = 'PLACE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  EXIT = 'EXIT',
}

export type DirectionAndCoordinates = {
  coordinates: RobotCoordinate;
  direction: Direction;
};

export type CommandAndDescription = {
  command: string;
  description: string;
};

export type CommandAnswer = {
  command: string;
};
