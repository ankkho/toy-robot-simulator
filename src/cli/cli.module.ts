import { Module } from '@nestjs/common';
import { RobotModule } from '../robot/robot.module';
import { PromptCommand } from './prompt.command';
import { ProcessCommand } from './process.command';

@Module({
	exports: [ProcessCommand],
	imports: [RobotModule],
	providers: [PromptCommand, ProcessCommand],
})
export class CliModule {}
