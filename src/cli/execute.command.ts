import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RobotService } from '../robot/robot.service';
import { RobotNotPlacedError } from '../robot/errors/robot.errors';
import { ValidCommands } from './types.js';
import { getCoodinatesAndDirectionFromPlaceCommand } from './utils.js';
import { InvalidCommandError } from './errors.js';

@Injectable()
export class ExecuteCommand {
  constructor(
    private readonly logger: PinoLogger,
    private readonly robotService: RobotService,
  ) {}

  otherCommands(command: ValidCommands): void | Error {
    if (!this.robotService.isPlaced()) {
      throw new RobotNotPlacedError();
    }

    switch (command) {
      case ValidCommands.LEFT: {
        console.log(this.robotService.turnLeft());
        break;
      }

      case ValidCommands.RIGHT: {
        console.log(this.robotService.turnRight());
        break;
      }

      case ValidCommands.REPORT: {
        console.log(this.robotService.report());
        break;
      }

      case ValidCommands.MOVE: {
        console.log(this.robotService.move());
        break;
      }

      default: {
        throw new InvalidCommandError(command);
      }
    }
  }

  execute(command: string): void {
    try {
      if (command.startsWith(ValidCommands.PLACE)) {
        const { coordinates, direction } = getCoodinatesAndDirectionFromPlaceCommand(command);
        const response = this.robotService.place(coordinates, direction);
        console.log(response);
      } else {
        const normalizedCommand = command.toUpperCase();
        this.otherCommands(normalizedCommand as ValidCommands);
      }
    } catch (error) {
      if (error instanceof Error) {
        const { message, name, stack } = error;
        this.logger.error(message, { name, stack });

        console.error(`\n Error: ${message}`);
      } else {
        this.logger.error('An unknown error occurred.');

        console.error("\n 'An unknown error occurred.");
      }
    }
  }
}
