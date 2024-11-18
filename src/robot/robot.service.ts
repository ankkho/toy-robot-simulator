import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Injectable()
export class RobotService {
	constructor(
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>,
	) {}
}
