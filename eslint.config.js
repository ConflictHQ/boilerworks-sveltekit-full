import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', 'drizzle/**']
	},
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'svelte/no-at-html-tags': 'off'
		}
	}
];
