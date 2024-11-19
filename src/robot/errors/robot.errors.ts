export class RobotNotPlacedError extends Error {
	constructor() {
		super('The robot must be placed before any commands can be executed. Use PLACE command to place the robot. Eg: PLACE 1,2,NORTH');
		this.name = 'RobotNotPlacedError';
	}
}
