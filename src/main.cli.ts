import { CommandFactory } from 'nest-commander';
import { AppCliModule } from './app.cli.module';

(async () => {
	await CommandFactory.run(AppCliModule, {
		logger: ['warn', 'error'],
	});
})();
