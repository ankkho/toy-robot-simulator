import Table from 'cli-table3';

export const displayCommandTable = () => {
	const table = new Table({
		head: ['Command', 'Description'],
		colWidths: [20, 130],
	});

	table.push(
		[
			'PLACE',
			'Places the robot on the table. Should provide x and y coordinates (range 0-5), along with a direction. Eg: PLACE 1,3,NORTH',
		],
		['MOVE', 'Will move the robot one unit forward in the direction it is currently facing'],
		['LEFT', 'Rotates robot 90 degrees to the left from the current direction'],
		['RIGHT', 'Rotates robot 90 degrees to the right from the current direction'],
		['REPORT', 'Prints the current position and direction of the robot'],
		['EXIT', 'Exit the application'],
	);

	console.info(table.toString());
};
