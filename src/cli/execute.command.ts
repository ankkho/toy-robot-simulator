import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RobotService } from '../robot/robot.service';
import { RobotNotPlacedError } from '../robot/errors/robot.errors';
import { ValidCommands } from './types.js';
import { getCoodinatesAndDirectionFromPlaceCommand } from './utils.js';
import { InvalidCommandError } from './errors.js';

/**
 * Service responsible for executing robot commands.
 * Commands include movement and orientation actions like MOVE, LEFT, RIGHT, REPORT, and PLACE.
 */
@Injectable()
export class ExecuteCommand {
	/**
	 * Creates an instance of ExecuteCommand.
	 * @param logger - Logger instance for logging errors and debug information.
	 * @param robotService - RobotService to interact with the robot for command execution.
	 */
	constructor(
		private readonly logger: PinoLogger,
		private readonly robotService: RobotService,
	) {}

	/**
	 * Handles commands other than PLACE.
	 * Throws an error if the robot is not placed.
	 * Executes commands like MOVE, LEFT, RIGHT, and REPORT.
	 * @param command - The command to execute (MOVE, LEFT, RIGHT, REPORT).
	 * @throws RobotNotPlacedError if the robot is not placed.
	 * @throws InvalidCommandError for an invalid command.
	 */
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

	/**
	 * Executes a command on the robot.
	 * If the command is PLACE, it places the robot at the specified coordinates and direction.
	 * Otherwise, it processes other commands such as MOVE, LEFT, RIGHT, and REPORT.
	 * @param command - The command to execute.
	 * @throws InvalidCommandError if the command is invalid.
	 * @throws RobotNotPlacedError if the robot is not placed when attempting to execute other commands.
	 */
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
