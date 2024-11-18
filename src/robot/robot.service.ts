import { Injectable } from '@nestjs/common';
import { Direction, RobotCoordinate } from './types.js';
import { Robot } from './robot.js';

@Injectable()
export class RobotService {
  constructor(private readonly robot: Robot) {}

  place(newCoordinates: RobotCoordinate, newDirection: Direction): string {
    const { x, y, direction } = this.robot.place(newCoordinates, newDirection);
    return `Robot placed successfully at position X: ${x}, Y: ${y}, Direction: ${direction}`;
  }

  move(): string {
    return this.robot.move();
  }

  turnLeft(): string {
    return this.robot.turnToLeft();
  }

  turnRight(): string {
    return this.robot.turnToRight();
  }

  report(): string {
    return this.robot.getReport();
  }

  getCoordinates(): RobotCoordinate {
    return this.robot.getCoodinates();
  }
}
