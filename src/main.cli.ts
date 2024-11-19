import { CommandFactory } from 'nest-commander';
import { CliAppModule } from './cli.app.module';

(async () => {
	await CommandFactory.run(CliAppModule, {
		logger: ['warn', 'error'],
	});
})();
