import inquirer from 'inquirer';
import { PinoLogger } from 'nestjs-pino';
import { Command, CommandRunner } from 'nest-commander';
import { CommandAnswer, ValidCommands } from './types.js';
import { commandAndDescriptions } from './utils.js';
import { InvalidCommandError, InvalidPlaceCommandError } from './errors.js';
import { ExecuteCommand } from './execute.command';

/**
 * Handles the command-line interaction for the toy robot simulator.
 * Prompts the user for input, validates commands, and executes them.
 */
@Command({ name: 'start', description: 'Start the toy robot simulator!' })
export class PromptCommand extends CommandRunner {
  /**
   * Regular expression for validating PLACE commands.
   * Ensures commands follow the format: PLACE X,Y,DIRECTION.
   */
  get placeCommandFormat(): RegExp {
    return /^place\s+[0-5],[0-5],(north|south|east|west)$/i;
  }

  /**
   * Constructs the `PromptCommand` class.
   * @param logger - Logger for recording errors and debug information.
   * @param executeCommand - Service for executing valid commands.
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly executeCommand: ExecuteCommand,
  ) {
    super();
  }

  /**
   * Starts the command-line interaction loop.
   * Displays command details, prompts for input, validates the command, and executes it.
   */
  async run(): Promise<void> {
    this.commandDetails();

    const answers = await inquirer.prompt<CommandAnswer>([
      {
        type: 'input',
        name: 'command',
        message: 'Provide a command to your robot:',
        transformer: (input: string) => input.toUpperCase(),
        validate: (input: string) => this.validate(input),
      },
    ]);

    const normalizedCommand = answers.command.toUpperCase();
    this.executeCommand.execute(normalizedCommand);

    console.log('\n Continue.. \n');
    await this.run();
  }

  /**
   * Validates the user-provided command.
   * @param input - The command string to validate.
   * @returns `true` if the command is valid; otherwise, logs the error and returns `false`.
   */
  validate(input: string): boolean {
    try {
      const normalizedCommand = input.toUpperCase();

      if (normalizedCommand.startsWith(ValidCommands.PLACE)) {
        if (!this.placeCommandFormat.test(normalizedCommand)) {
          throw new InvalidPlaceCommandError();
        }
      } else if (!Object.values(ValidCommands).includes(normalizedCommand.trim() as ValidCommands)) {
        throw new InvalidCommandError(normalizedCommand);
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        const { message, name, stack } = error;
        this.logger.error(message, { name, stack });
        console.error(`\n Error: ${message}`);
      } else {
        this.logger.error('An unknown error occurred.');
        console.error("\n 'An unknown error occurred.");
      }

      return false;
    }
  }

  /**
   * Displays a list of available commands and their descriptions.
   */
  private commandDetails(): void {
    console.info('Following are the available commands:');
    for (const details of commandAndDescriptions) {
      const { command, description } = details;
      console.info(command, '--', description);
    }

    console.log('\n');
  }
}
