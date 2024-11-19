import { type Direction, type RobotCoordinate } from 'src/robot/types';
import { type CommandAndDescription, type DirectionAndCoordinates, ValidCommands } from './types.js';

export const isValidCommand = (command: string): boolean =>
	Object.values(ValidCommands).includes(command as ValidCommands);

export const placeCommandRegEx = /^place\s+[0-5],[0-5],(north|south|east|west)$/i;

export const getCoodinatesAndDirectionFromPlaceCommand = (placeCommand: string): DirectionAndCoordinates => {
	const coordinateAndDirection = placeCommand.replace(/^PLACE\s*/, '');

	const [x, y, direction] = coordinateAndDirection.split(',');
	const coordinates: RobotCoordinate = {
		x: Number.parseInt(x, 10),
		y: Number.parseInt(y, 10),
	};

	return {
		coordinates,
		direction: direction.toUpperCase() as Direction,
	};
};

export const commandAndDescriptions: CommandAndDescription[] = [
	{
		command: 'PLACE',
		description:
			'Places the robot on the table. Provide x and y coordinates (range 0-5), along with a direction. Eg: PLACE 1,3,NORTH',
	},
	{
		command: 'MOVE',
		description: 'Will move the robot one unit forward in the direction it is currently facing',
	},
	{
		command: 'LEFT',
		description: 'Rotates robot 90 degrees to the left from the current direction',
	},
	{
		command: 'RIGHT',
		description: 'Rotates robot 90 degrees to the right from the current direction',
	},
	{
		command: 'REPORT',
		description: 'Prints the current position and direction of the robot',
	},
];
