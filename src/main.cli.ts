import * as figlet from 'figlet';
import { CommandFactory } from 'nest-commander';
import { CliAppModule } from './cli.app.module';

(async () => {
	const app = CommandFactory.createWithoutRunning(CliAppModule, {
		logger: ['warn', 'error'],
	});

	console.log(figlet.textSync('Toy Robot Simulator'));

	const initApp = await app;
	await CommandFactory.runApplication(initApp);
})();
