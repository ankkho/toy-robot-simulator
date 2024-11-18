import inquirer from 'inquirer';
import { PinoLogger } from 'nestjs-pino';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { CommandAnswer, ValidCommands } from './types.js';
import { commandAndDescriptions, isValidCommand, placeCommandRegEx } from './utils.js';
import { InvalidCommandError, InvalidPlaceCommandError } from './errors.js';

@Command({ name: 'start', description: 'Start the toy robot simulator!' })
export class PromptQuestion extends CommandRunner {
  constructor(private readonly logger: PinoLogger) {
    super();
  }

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

    console.log(answers.command);
  }

  private validate(input: string): boolean {
    try {
      const normalizedCommand = input.toUpperCase();

      if (!isValidCommand(normalizedCommand) && !normalizedCommand.startsWith(ValidCommands.PLACE)) {
        throw new InvalidCommandError(input);
      }

      if (normalizedCommand.startsWith(ValidCommands.PLACE) && !placeCommandRegEx.test(normalizedCommand)) {
        throw new InvalidPlaceCommandError();
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

  private commandDetails(): void {
    console.info('Following are the available commands:');
    for (const details of commandAndDescriptions) {
      const { command, description } = details;
      console.info(command, '--', description);
    }

    console.log('\n');
  }
}