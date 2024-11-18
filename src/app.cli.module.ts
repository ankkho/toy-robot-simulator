import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RobotModule } from './robot/robot.module';
import { CliModule } from './cli/cli.module';
import configuration from './config/configuration.js';
import { PromptQuestion } from './cli/prompt.js';

@Module({
	imports: [
		LoggerModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		RobotModule,
		CliModule,
	],
	providers: [PromptQuestion],
})
export class AppCliModule {}
