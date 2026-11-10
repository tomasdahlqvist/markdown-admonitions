import { defineConfig } from '@vscode/test-cli';
import { readFileSync } from 'node:fs';

const { engines } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const minimumVersion = engines.vscode.replace(/^\^/, '');

export default defineConfig([
	{
		label: 'minimum',
		version: minimumVersion,
		files: 'out/test/**/*.test.js',
		mocha: { timeout: 10000 },
	},
	{
		label: 'stable',
		version: 'stable',
		files: 'out/test/**/*.test.js',
		mocha: { timeout: 10000 },
	},
]);
