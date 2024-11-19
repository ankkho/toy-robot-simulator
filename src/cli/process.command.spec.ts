import { Test, type TestingModule } from '@nestjs/testing';
import { mock, mockReset } from 'jest-mock-extended';
import { CliAppModule } from '../cli.app.module';
import { RobotService } from '../robot/robot.service';
import { RobotNotPlacedError } from '../robot/errors/robot.errors';
import { ExecuteCommand } from './execute.command';
import { ValidCommands } from './types.js';
import { InvalidCommandError } from './errors.js';
import { getCoodinatesAndDirectionFromPlaceCommand } from './utils.js';

jest.mock('./utils');

describe('ExecuteCommand', () => {
  let executeCommand: ExecuteCommand;
  const mockRobotService = mock<RobotService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CliAppModule],
    })
      .overrideProvider(RobotService)
      .useValue(mockRobotService)
      .compile();

    executeCommand = module.get<ExecuteCommand>(ExecuteCommand);
  });

  beforeEach(() => {
    mockReset(mockRobotService);
  });

  it('should be defined', () => {
    expect(executeCommand).toBeDefined();
  });

  describe('execute', () => {
    it('should execute PLACE command correctly', () => {
      const command = 'PLACE 1,2,NORTH';
      const mockCoordinates = { x: 1, y: 2 };
      const mockDirection = 'NORTH';

      (getCoodinatesAndDirectionFromPlaceCommand as jest.Mock).mockReturnValue({
        coordinates: mockCoordinates,
        direction: mockDirection,
      });

      mockRobotService.place.mockReturnValue('Placed successfully at 1,2,NORTH');
      executeCommand.execute(command);

      expect(getCoodinatesAndDirectionFromPlaceCommand).toHaveBeenCalledWith(command);
      expect(mockRobotService.place).toHaveBeenCalledWith(mockCoordinates, mockDirection);
    });

    it('should execute other commands correctly when robot is placed', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      mockRobotService.move.mockReturnValue('Moved successfully');

      executeCommand.execute('MOVE');

      expect(mockRobotService.isPlaced).toHaveBeenCalled();
      expect(mockRobotService.move).toHaveBeenCalled();
    });

    it('should log and console.error when RobotNotPlacedError is thrown', () => {
      const command = 'MOVE';

      mockRobotService.isPlaced.mockReturnValue(false);
      expect(() => {
        executeCommand.otherCommands(ValidCommands.MOVE);
      }).toThrow(RobotNotPlacedError);
    });

    it('should log and execute generic errors', () => {
      const command = 'PLACE 1,2,NORTH';
      const error = new Error('Unexpected error');

      (getCoodinatesAndDirectionFromPlaceCommand as jest.Mock).mockImplementation(() => {
        throw error;
      });

      executeCommand.execute(command);
    });
  });

  describe('otherCommands', () => {
    it('should execute LEFT command', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      mockRobotService.turnLeft.mockReturnValue('Turned left');

      executeCommand.otherCommands(ValidCommands.LEFT);

      expect(mockRobotService.isPlaced).toHaveBeenCalled();
      expect(mockRobotService.turnLeft).toHaveBeenCalled();
    });

    it('should execute RIGHT command', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      mockRobotService.turnRight.mockReturnValue('Turned right');

      executeCommand.otherCommands(ValidCommands.RIGHT);

      expect(mockRobotService.isPlaced).toHaveBeenCalled();
      expect(mockRobotService.turnRight).toHaveBeenCalled();
    });

    it('should execute REPORT command', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      mockRobotService.report.mockReturnValue('Robot report');

      executeCommand.otherCommands(ValidCommands.REPORT);

      expect(mockRobotService.isPlaced).toHaveBeenCalled();
      expect(mockRobotService.report).toHaveBeenCalled();
    });

    it('should execute MOVE command', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      mockRobotService.move.mockReturnValue('Moved successfully');

      executeCommand.otherCommands(ValidCommands.MOVE);

      expect(mockRobotService.isPlaced).toHaveBeenCalled();
      expect(mockRobotService.move).toHaveBeenCalled();
    });

    it('should throw InvalidCommandError for unknown commands', () => {
      mockRobotService.isPlaced.mockReturnValue(true);
      const invalidCommand = 'TEST' as ValidCommands;

      expect(() => executeCommand.otherCommands(invalidCommand)).toThrow(InvalidCommandError);
    });
  });
});
