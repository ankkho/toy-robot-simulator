import { type ConfigService } from '@nestjs/config';
import { type TableConfig, type Config } from 'src/config/configuration';
import { type PinoLogger } from 'nestjs-pino';
import {
	Direction,
	directionsForTurnLeft,
	directionsForTurnRight,
	type NewPositon,
	type RobotCoordinate,
} from './types.js';
import { InvalidCoordinatesError } from './errors/table.errors';

export class Robot {
	constructor(
		private readonly config: ConfigService<Config>,
		private readonly logger: PinoLogger,
		private coordinates: RobotCoordinate,
		private direction: Direction = Direction.NORTH,
	) {}

	place(newCoordinates: RobotCoordinate, newDirection: Direction): NewPositon {
		this.coordinates = newCoordinates;
		this.direction = newDirection;

		this.logger.info(
			{
				x: this.coordinates.x,
				y: this.coordinates.y,
				direction: this.direction,
			},
			'Robot placed successfully. New Coordinates set.',
		);

		return {
			x: this.coordinates.x,
			y: this.coordinates.y,
			direction: this.direction,
		};
	}

	move(): string {
		const newCoordinates = this.calculateNewCoordinates();
		this.validateCoordinates(newCoordinates);
		this.coordinates = newCoordinates;
		return this.moveResponse();
	}

	turnToLeft(): string {
		this.direction = directionsForTurnLeft[this.direction];
		this.logger.info(`Robot moved to left. New direction: ${this.direction}`);
		return `Robot successfully turned left. New direction: ${this.direction}`;
	}

	turnToRight(): string {
		this.direction = directionsForTurnRight[this.direction];
		this.logger.info(`Robot moved to right. New direction: ${this.direction}`);
		return `Robot successfully turned right. New direction: ${this.direction}`;
	}

	getReport(): string {
		this.logger.info(
			`REPORT command invoked. X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`,
		);
		return `Current Position of Robot: X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`;
	}

	getCoodinates(): RobotCoordinate {
		return this.coordinates;
	}

	private moveResponse() {
		this.logger.info(
			{
				x: this.coordinates.x,
				y: this.coordinates.y,
				direction: this.direction,
			},
			'New Coordinates. Robot moved successfully',
		);
		return `Robot successfully moved. New Coordinates: X: ${this.coordinates.x}, Y: ${this.coordinates.y}, Direction: ${this.direction}`;
	}

	private calculateNewCoordinates(): RobotCoordinate {
		const newCoordinates = { ...this.coordinates };

		switch (this.direction) {
			case Direction.NORTH: {
				newCoordinates.y += 1;
				break;
			}

			case Direction.SOUTH: {
				newCoordinates.y -= 1;
				break;
			}

			case Direction.EAST: {
				newCoordinates.x += 1;
				break;
			}

			case Direction.WEST: {
				newCoordinates.x -= 1;
				break;
			}
		}

		return newCoordinates;
	}

	private validateCoordinates(coordinates: RobotCoordinate): void {
		const { x, y } = coordinates;
		const tableConfig = this.config.get<TableConfig>('tableConfig');

		const xCoordinatesForTable = tableConfig?.maxCoordinates.x ?? 5;
		const yCoordinatesForTable = tableConfig?.maxCoordinates.y ?? 5;

		if (x < 0 || x > xCoordinatesForTable || y < 0 || y > yCoordinatesForTable) {
			this.logger.error(
				{
					x,
					y,
					tableLimit: {
						x: xCoordinatesForTable,
						y: yCoordinatesForTable,
					},
				},
				'Invalid move: coordinates have reached max limit of table',
			);
			throw new InvalidCoordinatesError(xCoordinatesForTable, yCoordinatesForTable);
		}
	}
}
