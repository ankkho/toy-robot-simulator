import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';
import {
	Direction,
	directionsForTurnLeft,
	directionsForTurnRight,
	RobotCoordinate,
} from './types.js';

export class Robot {
	constructor(
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>,
		private readonly coordinates: RobotCoordinate,
		private direction: Direction = Direction.NORTH,
	) {}

	turnToLeft(): string {
		this.direction = directionsForTurnLeft[this.direction];
		return `Robot successfully turned left. New direction: ${this.direction}`;
	}

	turnToRight(): string {
		this.direction = directionsForTurnRight[this.direction];
		return `Robot successfully turned right. New direction: ${this.direction}`;
	}

	getReport(): string {
		return `Current Position of Robot: X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`;
	}

	getCoodinates(): RobotCoordinate {
		return this.coordinates;
	}
}
