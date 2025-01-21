const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

const copyWasmFiles = {
	name: "copy-wasm-files",
	setup(build) {
		build.onEnd(() => {
			const sourceDir = path.join(__dirname, "node_modules", "web-tree-sitter")
			const targetDir = path.join(__dirname, "dist")

			// Copy tree-sitter.wasm
			fs.copyFileSync(path.join(sourceDir, "tree-sitter.wasm"), path.join(targetDir, "tree-sitter.wasm"))

			// Copy language-specific WASM files
			const languageWasmDir = path.join(__dirname, "node_modules", "tree-sitter-wasms", "out")
			// https://github.com/tree-sitter/tree-sitter.github.io/tree/master
			const languages = [
				"typescript",
				"tsx",
				"python",
				"rust",
				"javascript",
				"go",
				"cpp",
				"php",
				"c",
				"c_sharp",
				"ruby",
				"java",
				"swift",
			]

			languages.forEach((lang) => {
				const filename = `tree-sitter-${lang}.wasm`
				fs.copyFileSync(path.join(languageWasmDir, filename), path.join(targetDir, filename))
			})
		})
	},
}

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			copyWasmFiles,
			esbuildProblemMatcherPlugin,
		],
		alias: {
			'vs/editor/browser/widget': '../../src/vs/editor/browser/widget',
			'@/*': './src/*'
		}
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}
main().catch(e => {
	console.error(e);
	process.exit(1);
});



// const esbuild = require("esbuild");

// const production = process.argv.includes('--production');
// const watch = process.argv.includes('--watch');

// /**
//  * @type {import('esbuild').Plugin}
//  */
// const esbuildProblemMatcherPlugin = {
// 	name: 'esbuild-problem-matcher',

// 	setup(build) {
// 		build.onStart(() => {
// 			console.log('[watch] build started');
// 		});
// 		build.onEnd((result) => {
// 			result.errors.forEach(({ text, location }) => {
// 				console.error(`✘ [ERROR] ${text}`);
// 				console.error(`    ${location.file}:${location.line}:${location.column}:`);
// 			});
// 			console.log('[watch] build finished');
// 		});
// 	},
// };

// async function main() {
// 	const ctx = await esbuild.context({
// 		entryPoints: [
// 			'src/extension.ts'
// 		],
// 		bundle: true,
// 		format: 'cjs',
// 		minify: production,
// 		sourcemap: !production,
// 		sourcesContent: false,
// 		platform: 'node',
// 		outfile: 'dist/extension.js',
// 		external: ['vscode'],
// 		logLevel: 'silent',
// 		plugins: [
// 			/* add to the end of plugins array */
// 			esbuildProblemMatcherPlugin,
// 		],
// 	});
// 	if (watch) {
// 		await ctx.watch();
// 	} else {
// 		await ctx.rebuild();
// 		await ctx.dispose();
// 	}
// }

// main().catch(e => {
// 	console.error(e);
// 	process.exit(1);
// });
