import { Injectable, OnModuleInit } from '@nestjs/common';
import { Direction, RobotCoordinate } from './types.js';
import { Robot } from './robot.js';

/**
 * Service to handle robot control logic, including placement, movement, and reporting.
 * This service interacts with the `Robot` class to perform actions.
 */
@Injectable()
export class RobotService implements OnModuleInit {
	/**
	 * Constructor for the RobotService class.
	 * @param {Robot} robot - The Robot instance used for robot operations.
	 */
	constructor(private readonly robot: Robot) {}

	/**
	 * Initializes the robot with default coordinates and direction when the module is initialized.
	 */
	public onModuleInit(): void {
		const defaultCoordinates: RobotCoordinate = { x: 0, y: 0 };
		this.robot.init(defaultCoordinates, Direction.NORTH);
	}

	/**
	 * Places the robot at new coordinates with a specified direction.
	 * @param {RobotCoordinate} newCoordinates - The new coordinates for the robot.
	 * @param {Direction} newDirection - The direction the robot should face.
	 * @returns {string} A message confirming the robot's placement.
	 */
	place(newCoordinates: RobotCoordinate, newDirection: Direction): string {
		const { x, y, direction } = this.robot.place(newCoordinates, newDirection);
		return `Robot placed successfully at position X: ${x}, Y: ${y}, Direction: ${direction}`;
	}

	/**
	 * Moves the robot one step in its current direction.
	 * @returns {string} The result of the move operation.
	 */
	move(): string {
		return this.robot.move();
	}

	/**
	 * Turns the robot to the left from its current direction.
	 * @returns {string} The result of the left turn operation.
	 */
	turnLeft(): string {
		return this.robot.turnToLeft();
	}

	/**
	 * Turns the robot to the right from its current direction.
	 * @returns {string} The result of the right turn operation.
	 */
	turnRight(): string {
		return this.robot.turnToRight();
	}

	/**
	 * Generates a report of the robot's current position and direction.
	 * @returns {string} A string containing the robot's current status.
	 */
	report(): string {
		return this.robot.getReport();
	}

	/**
	 * Retrieves the current coordinates of the robot.
	 * @returns {RobotCoordinate} The robot's current coordinates.
	 */
	getCoordinates(): RobotCoordinate {
		return this.robot.getCoodinates();
	}

	/**
	 * Checks whether the robot has been placed on the grid.
	 * @returns {boolean} True if the robot has been placed, false otherwise.
	 */
	isPlaced(): boolean {
		return this.robot.isRobotPlaced();
	}
}
