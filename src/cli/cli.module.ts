import { Module } from '@nestjs/common';
import { Prompt } from './cli.prompt';

@Module({
	providers: [Prompt],
})
export class CliModule {}
