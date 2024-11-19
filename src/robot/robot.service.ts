import { Injectable, OnModuleInit } from '@nestjs/common';
import { Direction, RobotCoordinate } from './types.js';
import { Robot } from './robot.js';

@Injectable()
export class RobotService implements OnModuleInit {
	constructor(private readonly robot: Robot) {}

	public onModuleInit(): void {
		const defaultCoordinates: RobotCoordinate = { x: 0, y: 0 };
		this.robot.init(defaultCoordinates, Direction.NORTH);
	}

	place(newCoordinates: RobotCoordinate, newDirection: Direction): string {
		const { x, y, direction } = this.robot.place(newCoordinates, newDirection);
		return `Robot placed successfully at position X: ${x}, Y: ${y}, Direction: ${direction}`;
	}

	move(): string {
		return this.robot.move();
	}

	turnLeft(): string {
		return this.robot.turnToLeft();
	}

	turnRight(): string {
		return this.robot.turnToRight();
	}

	report(): string {
		return this.robot.getReport();
	}

	getCoordinates(): RobotCoordinate {
		return this.robot.getCoodinates();
	}

	isPlaced(): boolean {
		return this.robot.isRobotPlaced();
	}
}
