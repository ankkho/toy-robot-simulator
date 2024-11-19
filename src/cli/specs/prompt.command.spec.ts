import { Test, type TestingModule } from '@nestjs/testing';
import { mock, mockReset } from 'jest-mock-extended';
import { CliAppModule } from '../../cli.app.module';
import { Direction } from '../../robot/types.js';
import { ExecuteCommand } from '../execute.command';
import { ValidCommands } from '../types.js';
import { PromptCommand } from '../prompt.command';

jest.mock('../utils');

describe('PromptCommand', () => {
	let promptCommand: PromptCommand;
	const executeCommand = mock<ExecuteCommand>();

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [CliAppModule],
		})
			.overrideProvider(ExecuteCommand)
			.useValue(executeCommand)
			.compile();

		promptCommand = module.get<PromptCommand>(PromptCommand);
	});

	beforeEach(() => {
		mockReset(executeCommand);
	});

	it('should be defined', () => {
		expect(promptCommand).toBeDefined();
	});

	describe('validate', () => {
		it('should return true for valid commands', () => {
			expect(promptCommand.validate(`${ValidCommands.PLACE} 1,1,${Direction.EAST}`)).toBe(true);
			expect(promptCommand.validate(ValidCommands.LEFT)).toBe(true);
			expect(promptCommand.validate(ValidCommands.RIGHT)).toBe(true);
			expect(promptCommand.validate(ValidCommands.MOVE)).toBe(true);
			expect(promptCommand.validate(ValidCommands.REPORT)).toBe(true);
		});

		it('should log an error and return false for invalid command', () => {
			const invalidCommand = 'INVALID';
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
			expect(promptCommand.validate(invalidCommand)).toBe(false);
			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Invalid command'));

			consoleErrorSpy.mockRestore();
		});

		describe('Invalid PLACE command', () => {
			const invalidPlaceCommands = ['Place -1,10,SAMPLE', 'PLACE 1,1,', 'PLACE ,,1,21', 'PLACE 101,12112, WEST'];

			test.each(invalidPlaceCommands)('should log an error and return false for when PLACE command is not valid: %p', (invalidCommand) => {
				const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
				expect(promptCommand.validate(invalidCommand)).toBe(false);

				expect(consoleErrorSpy).toHaveBeenCalledWith(
					expect.stringContaining('Invalid format for PLACE command. Should provide x,y coordinates between (0-5), and direction. Eg: 1,2,NORTH'),
				);

				consoleErrorSpy.mockRestore();
			});
		});
	});
});
