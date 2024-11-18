module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': () => [0, 'always', 50],
		'subject-case': () => [0, 'always', 'lower-case'],
	},
};
