export class InvalidCommandError extends Error {
	constructor(command: string) {
		super(`Invalid command: ${command}`);
		this.name = 'InvalidCommandError';
	}
}

export class InvalidPlaceCommandError extends Error {
	constructor() {
		super('Invalid format for PLACE command. Should provide x,y coordinates between (0-5), and direction. Eg: 1,2,NORTH');
		this.name = 'InvalidPlaceCommandError';
	}
}
