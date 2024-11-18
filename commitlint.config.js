// Documentation https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md

const config = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': () => [0, 'always', 72],
		'subject-case': () => [0, 'always', 'lower-case'],
	},
};

export default config;
