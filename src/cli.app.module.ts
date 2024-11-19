import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { RobotModule } from './robot/robot.module';
import { CliModule } from './cli/cli.module';
import configuration from './config/configuration.js';
import { PromptCommand } from './cli/prompt.command.js';
import schema from './config/config.schema';

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: {
				stream: pino.destination({
					dest: './logs/app.log',
					minLength: 4096,
					sync: false,
				}),
			},
		}),
		ConfigModule.forRoot({
			ignoreEnvFile: false,
			isGlobal: true,
			cache: true,
			load: [configuration],
			validationSchema: schema,
			validationOptions: {
				stripUnknown: true,
				abortEarly: true,
			},
		}),
		RobotModule,
		CliModule,
	],
	providers: [PromptCommand],
})
export class CliAppModule {}
