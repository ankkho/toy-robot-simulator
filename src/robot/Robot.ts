import { ConfigType } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Inject, Injectable } from '@nestjs/common';
import configuration from '../config/configuration.js';
import { Direction, directionsForTurnLeft, directionsForTurnRight, NewPositon, RobotCoordinate } from './types.js';
import { InvalidCoordinatesError } from './errors/table.errors';

/**
 * Represents a robot with placement, movement, and direction functionality.
 */
@Injectable()
export class Robot {
  private isPlaced: boolean;
  private coordinates: RobotCoordinate;
  private direction: Direction;

  constructor(
    @Inject(configuration.KEY) private readonly config: ConfigType<typeof configuration>,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Initializes the robot's starting position and direction.
   * @param coordinates Initial coordinates of the robot.
   * @param direction Initial direction the robot faces.
   */
  init(coordinates: RobotCoordinate, direction: Direction): void {
    this.coordinates = coordinates;
    this.direction = direction;
    this.isPlaced = false;
  }

  /**
   * Places the robot at the specified coordinates and direction.
   * @param newCoordinates Coordinates where the robot will be placed.
   * @param newDirection Direction the robot will face.
   * @returns The robot's new position and direction.
   */
  place(newCoordinates: RobotCoordinate, newDirection: Direction): NewPositon {
    this.coordinates = newCoordinates;
    this.direction = newDirection;

    this.logger.info(
      {
        x: this.coordinates.x,
        y: this.coordinates.y,
        direction: this.direction,
      },
      'Robot placed successfully. New Coordinates set.',
    );

    this.isPlaced = true;

    return {
      x: this.coordinates.x,
      y: this.coordinates.y,
      direction: this.direction,
    };
  }

  /**
   * Checks if the robot has been placed on the table.
   * @returns True if the robot is placed; otherwise, false.
   */
  isRobotPlaced(): boolean {
    return this.isPlaced;
  }

  /**
   * Moves the robot one step in its current direction.
   * @returns A message indicating the robot's new position.
   */
  move(): string {
    const newCoordinates = this.calculateNewCoordinates();
    this.validateCoordinates(newCoordinates);
    this.coordinates = newCoordinates;
    return this.moveResponse();
  }

  /**
   * Turns the robot 90 degrees to the left.
   * @returns A message with the robot's new direction.
   */
  turnToLeft(): string {
    this.direction = directionsForTurnLeft[this.direction];
    this.logger.info(`Robot moved to left. New direction: ${this.direction}`);
    return `Robot successfully turned left. New direction: ${this.direction}`;
  }

  /**
   * Turns the robot 90 degrees to the right.
   * @returns A message with the robot's new direction.
   */
  turnToRight(): string {
    this.direction = directionsForTurnRight[this.direction];
    this.logger.info(`Robot moved to right. New direction: ${this.direction}`);
    return `Robot successfully turned right. New direction: ${this.direction}`;
  }

  /**
   * Generates a report of the robot's current position and direction.
   * @returns A string describing the robot's current position.
   */
  getReport(): string {
    this.logger.info(`REPORT command invoked. X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`);
    return `Current Position of Robot: X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`;
  }

  /**
   * Retrieves the robot's current coordinates.
   * @returns The robot's current coordinates (X, Y).
   */
  getCoodinates(): RobotCoordinate {
    return this.coordinates;
  }

  /**
   * Logs the move response and returns a message with the new position.
   * @returns A message with the robot's new coordinates after moving.
   */
  private moveResponse() {
    this.logger.info(
      {
        x: this.coordinates.x,
        y: this.coordinates.y,
        direction: this.direction,
      },
      'New Coordinates. Robot moved successfully',
    );
    return `Robot successfully moved. New Coordinates: X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`;
  }

  /**
   * Calculates the new coordinates after the robot moves in its current direction.
   * @returns The new coordinates (X, Y) after moving.
   */
  private calculateNewCoordinates(): RobotCoordinate {
    const newCoordinates = { ...this.coordinates };

    switch (this.direction) {
      case Direction.NORTH: {
        newCoordinates.y += 1;
        break;
      }

      case Direction.SOUTH: {
        newCoordinates.y -= 1;
        break;
      }

      case Direction.EAST: {
        newCoordinates.x += 1;
        break;
      }

      case Direction.WEST: {
        newCoordinates.x -= 1;
        break;
      }
    }

    return newCoordinates;
  }

  /**
   * Validates that the robot's coordinates are within the table's boundaries.
   * @param coordinates The coordinates to validate.
   * @throws InvalidCoordinatesError if the coordinates exceed the table's limits.
   */
  private validateCoordinates(coordinates: RobotCoordinate): void {
    const { x, y } = coordinates;
    const tableConfig = this.config.tableConfig;

    const xCoordinatesForTable = tableConfig?.maxCoordinates.x;
    const yCoordinatesForTable = tableConfig?.maxCoordinates.y;

    if (x < 0 || x > xCoordinatesForTable || y < 0 || y > yCoordinatesForTable) {
      this.logger.error(
        {
          x,
          y,
          tableLimit: {
            x: xCoordinatesForTable,
            y: yCoordinatesForTable,
          },
        },
        'Invalid move: coordinates have reached max limit of table',
      );
      throw new InvalidCoordinatesError(xCoordinatesForTable, yCoordinatesForTable);
    }
  }
}
