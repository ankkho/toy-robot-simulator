import inquirer from 'inquirer';
import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'start', description: 'Start the toy robot simulator!' })
export class Prompt extends CommandRunner {
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
