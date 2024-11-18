export class InvalidCoordinatesError extends Error {
	constructor(x: number, y: number) {
		super(
			`Invalid coordinates. Table is of size ${x}x${y}. Robot will fall of the table! Please change the direction or place robot to new coordinates`,
		);
		this.name = 'InvalidCoordinatesError';
	}
}
