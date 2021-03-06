import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import json from 'rollup-plugin-json';
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
// import builtins from 'builtin-modules'

import { terser } from 'rollup-plugin-terser';

import autoPreprocess from 'svelte-preprocess';
// import sass from 'svelte-preprocess-sass';
// import { sass } from "svelte-preprocess-sass";



const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		exports: 'named',
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js',
		target: 'electron-renderer',
		// externals: builtins,
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			// emitCss: true,
			css: css => {
				css.write('public/bundle.css');
			},
			preprocess: autoPreprocess(),
			// preprocess: {
      //   style: sass(),
      // },
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs

		// globals(),
		// json(),
		json(),
		resolve({
			jsnext: true,
      main: true,
		}),
		commonjs(),
		// builtins(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
