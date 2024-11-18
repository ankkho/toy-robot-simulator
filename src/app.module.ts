import {Module} from '@nestjs/common';
import {RobotCommand} from './basic.command';

@Module({
	imports: [],
	providers: [RobotCommand],
})
export class AppModule {}
