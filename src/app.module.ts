import { Module } from '@nestjs/common';
import { RobotCommand } from './basic.command';
import { RobotModule } from './robot/robot.module';

@Module({
	imports: [RobotModule],
	providers: [RobotCommand],
})
export class AppModule {}
