import inquirer from 'inquirer';
import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'run', description: 'Start the toy robot simulator!' })
export class RobotCommand extends CommandRunner {
	async run(): Promise<void> {
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'username',
				message: 'What is your name?',
			},
		]);

		console.log('Input:', answers);
	}
}