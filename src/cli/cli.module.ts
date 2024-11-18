import { Module } from '@nestjs/common';
import { PromptQuestion } from './prompt.js';

@Module({
	providers: [PromptQuestion],
})
export class CliModule {}
