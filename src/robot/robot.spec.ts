import { createMock } from '@golevelup/ts-jest';
import { Test, type TestingModule } from '@nestjs/testing';
import { type ConfigType } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import configuration from '../config/configuration.js';
import { Robot } from './robot.js';
import { InvalidCoordinatesError } from './errors/table.errors';
import { Direction, type RobotCoordinate } from './types.js';

describe('Robot', () => {
  let robot: Robot;
  let mockConfig: ConfigType<typeof configuration>;
  let mockLogger: PinoLogger;

  beforeEach(async () => {
    mockConfig = {
      nodeEnv: 'test',
      tableConfig: {
        maxCoordinates: { x: 5, y: 5 },
      },
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      fatal: jest.fn(),
      trace: jest.fn(),
      setContext: jest.fn(),
    } as unknown as PinoLogger;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Robot,
        {
          provide: configuration.KEY,
          useValue: mockConfig,
        },
        {
          provide: PinoLogger,
          useValue: createMock<PinoLogger>(),
        },
      ],
    }).compile();

    robot = module.get<Robot>(Robot);
  });

  it('should be defined', () => {
    expect(robot).toBeDefined();
  });

  describe('init()', () => {
    it('should initialize coordinates and direction', () => {
      const coordinates: RobotCoordinate = { x: 0, y: 0 };
      const direction: Direction = Direction.NORTH;

      robot.init(coordinates, direction);

      expect(robot.getCoodinates()).toEqual(coordinates);
      expect(robot.isRobotPlaced()).toBeFalsy();
    });
  });

  describe('place()', () => {
    it('should place robot with new coordinates and direction', () => {
      const coordinates: RobotCoordinate = { x: 1, y: 2 };
      const direction: Direction = Direction.EAST;

      const result = robot.place(coordinates, direction);

      expect(result).toEqual({
        x: coordinates.x,
        y: coordinates.y,
        direction,
      });
      expect(robot.isRobotPlaced()).toBeTruthy();
      expect(result).toEqual({
        x: 1,
        y: 2,
        direction: Direction.EAST,
      });
    });
  });

  describe('move()', () => {
    it('should move robot to new coordinates based on direction', () => {
      robot.place({ x: 2, y: 2 }, Direction.NORTH);

      const moveResult = robot.move();

      expect(moveResult).toContain('Robot successfully moved');
      expect(robot.getCoodinates()).toEqual({ x: 2, y: 3 });
    });

    it('should throw InvalidCoordinatesError when out of bounds', () => {
      robot.place({ x: 5, y: 5 }, Direction.NORTH);

      expect(() => robot.move()).toThrow(InvalidCoordinatesError);
    });
  });

  describe('turnToLeft()', () => {
    it('should turn robot left and change direction', () => {
      robot.place({ x: 1, y: 1 }, Direction.NORTH);

      const result = robot.turnToLeft();

      expect(result).toContain('Robot successfully turned left');
      expect(robot.getCoodinates()).toEqual({ x: 1, y: 1 });
      expect(result).toEqual('Robot successfully turned left. New direction: WEST');
    });
  });

  describe('turnToRight()', () => {
    it('should turn robot right and change direction', () => {
      robot.place({ x: 1, y: 1 }, Direction.NORTH);

      const result = robot.turnToRight();

      expect(result).toContain('Robot successfully turned right');
      expect(robot.getCoodinates()).toEqual({ x: 1, y: 1 });
      expect(result).toEqual('Robot successfully turned right. New direction: EAST');
    });
  });

  describe('getReport()', () => {
    it('should return a report of the current position', () => {
      robot.place({ x: 1, y: 2 }, Direction.SOUTH);

      const result = robot.getReport();

      expect(result).toBe('Current Position of Robot: X: 1, Y: 2, Direction: SOUTH');
      expect(result).toEqual('Current Position of Robot: X: 1, Y: 2, Direction: SOUTH');
    });
  });
});
