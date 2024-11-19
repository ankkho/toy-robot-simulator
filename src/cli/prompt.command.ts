import inquirer from 'inquirer';
import { PinoLogger } from 'nestjs-pino';
import { Command, CommandRunner } from 'nest-commander';
import { CommandAnswer, ValidCommands } from './types';
import { commandAndDescriptions } from './utils';
import { InvalidCommandError, InvalidPlaceCommandError } from './errors';
import { ExecuteCommand } from './execute.command';

@Command({ name: 'start', description: 'Start the toy robot simulator!' })
export class PromptCommand extends CommandRunner {
  placeCommandRegEx = /^place\s+[0-5],[0-5],(north|south|east|west)$/i;

  constructor(
    private readonly logger: PinoLogger,
    private readonly executeCommand: ExecuteCommand,
  ) {
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

    const normalizedCommand = answers.command.toUpperCase();
    this.executeCommand.execute(normalizedCommand);

    console.log('\n Continue.. \n');
    await this.run();
  }

  validate(input: string): boolean {
    try {
      const normalizedCommand = input.toUpperCase();

      if (normalizedCommand.startsWith(ValidCommands.PLACE)) {
        if (!this.placeCommandRegEx.test(normalizedCommand)) {
          throw new InvalidPlaceCommandError();
        }
      } else {
        if (!Object.values(ValidCommands).includes(normalizedCommand.trim() as ValidCommands)) {
          throw new InvalidCommandError(normalizedCommand);
        }
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
