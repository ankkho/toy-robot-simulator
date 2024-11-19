import { Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { RobotModule } from '../robot/robot.module';
import { PromptCommand } from './prompt.command';
import { ExecuteCommand } from './execute.command';

@Module({
  exports: [ExecuteCommand],
  imports: [RobotModule],
  providers: [PromptCommand, ExecuteCommand],
})
export class CliModule {}
