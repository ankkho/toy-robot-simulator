import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RobotModule } from './robot/robot.module';
import { CliModule } from './cli/cli.module';
import configuration from './config/configuration.js';
import { PromptCommand } from './cli/prompt.command.js';
import { join } from 'path';
import pino from 'pino';

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
      isGlobal: true,
      load: [configuration],
    }),
    RobotModule,
    CliModule,
  ],
  providers: [PromptCommand],
})
export class AppCliModule {}
