import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { ConfigType } from '@nestjs/config';
import configuration from '../config/configuration';
import { mockedConfig } from '../../test/test.utils';
import { Robot } from './robot';
import { Direction, RobotCoordinate } from './types';
import { CliAppModule } from '../cli.app.module';
import { mock, mockReset } from 'jest-mock-extended';

describe('RobotService', () => {
  let robotService: RobotService;
  const mockRobot = mock<Robot>();
  let mockConfig: ConfigType<typeof configuration>;

  beforeAll(async () => {
    mockConfig = mockedConfig;

    const module: TestingModule = await Test.createTestingModule({
      imports: [CliAppModule],
    })
      .overrideProvider(Robot)
      .useValue(mockRobot)
      .compile();

    robotService = module.get<RobotService>(RobotService);
  });

  beforeEach(() => {
    mockReset(mockRobot);
  });

  describe('onModuleInit()', () => {
    it('should initialize the robot with default coordinates and direction', () => {
      robotService.onModuleInit();
      expect(mockRobot.init).toHaveBeenCalledWith({ x: 0, y: 0 }, Direction.NORTH);
    });
  });

  describe('move', () => {
    it('should call mockRobot.move and return its result', () => {
      mockRobot.move.mockReturnValue('Moved successfully');

      const result = robotService.move();

      expect(mockRobot.move).toHaveBeenCalled();
      expect(result).toBe('Moved successfully');
    });
  });

  describe('turnLeft', () => {
    it('should call mockRobot.turnToLeft and return its result', () => {
      mockRobot.turnToLeft.mockReturnValue('Turned left');

      const result = robotService.turnLeft();

      expect(mockRobot.turnToLeft).toHaveBeenCalled();
      expect(result).toBe('Turned left');
    });
  });

  describe('turnRight', () => {
    it('should call mockRobot.turnToRight and return its result', () => {
      mockRobot.turnToRight.mockReturnValue('Turned right');

      const result = robotService.turnRight();

      expect(mockRobot.turnToRight).toHaveBeenCalled();
      expect(result).toBe('Turned right');
    });
  });

  describe('report', () => {
    it('should call mockRobot.getReport and return its result', () => {
      mockRobot.getReport.mockReturnValue('Robot report');

      const result = robotService.report();

      expect(mockRobot.getReport).toHaveBeenCalled();
      expect(result).toBe('Robot report');
    });
  });

  describe('getCoordinates', () => {
    it('should call mockRobot.getCoodinates and return its result', () => {
      const coordinates: RobotCoordinate = { x: 5, y: 7 };
      mockRobot.getCoodinates.mockReturnValue(coordinates);

      const result = robotService.getCoordinates();

      expect(mockRobot.getCoodinates).toHaveBeenCalled();
      expect(result).toEqual(coordinates);
    });
  });

  describe('isPlaced', () => {
    it('should call mockRobot.isRobotPlaced and return its result', () => {
      mockRobot.isRobotPlaced.mockReturnValue(true);

      const result = robotService.isPlaced();

      expect(mockRobot.isRobotPlaced).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
