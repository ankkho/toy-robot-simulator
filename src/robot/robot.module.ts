import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { Robot } from './robot.js';
import { Direction } from './types.js';

@Module({
	exports: [RobotService],
	providers: [
		{
			provide: Robot,
			useFactory() {
				const defaultCoordinates = { x: 0, y: 0 };
				const defaultDirection = Direction.NORTH;
				return new Robot(defaultCoordinates, defaultDirection);
			},
		},
		RobotService,
	],
})
export class RobotModule {}
