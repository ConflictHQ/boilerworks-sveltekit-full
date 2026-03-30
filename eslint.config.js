import tsParser from '@typescript-eslint/parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';
import svelteParser from 'svelte-eslint-parser';

export default [
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', 'drizzle/**']
	},
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
			},
		},
	},
	eslintConfigPrettier,
	{
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'svelte/no-at-html-tags': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-each-key': 'warn',
		}
	}
];
