import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { Robot } from './robot.js';

@Module({
	providers: [Robot, RobotService],
})
export class RobotModule {}
