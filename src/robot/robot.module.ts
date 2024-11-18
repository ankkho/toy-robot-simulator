import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';

@Module({
	imports: [],
	providers: [RobotService],
})
export class RobotModule {}
