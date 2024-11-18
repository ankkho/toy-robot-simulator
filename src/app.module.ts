import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RobotCommand } from './basic.command';
import { RobotModule } from './robot/robot.module';
import configuration from './config/configuration.js';

@Module({
	imports: [
		RobotModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
	],
	providers: [RobotCommand],
})
export class AppModule {}
