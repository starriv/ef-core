import chalk from 'chalk'

// Rollup plugins
import buble from 'rollup-plugin-buble'
import eslint from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import progress from 'rollup-plugin-progress'
import json from 'rollup-plugin-json'

switch (process.env.BUILD_ENV) {
	case 'DEV': {
		console.log(chalk.cyan('+--------------=+| DEVELOP BUILD |+=--------------+'))
		break
	}
	case 'CI': {
		console.log(chalk.green('+--------------=+| CI BUILD |+=--------------+'))
		break
	}
	default: {
		console.log(chalk.yellow('+--------------=+| NORMAL BUILD |+=--------------+'))
	}
}

// Log build environment
console.log('Build Target:', chalk.bold.green(process.env.BUILD_TARGET || 'development'))

export default {
	input: 'src/ef-core.js',
	output: {
		name: 'ef',
		format: 'umd',
		sourcemap: true
	},
	bundle: 'ef-core',
	devPath: 'test',
	proPath: 'dist',
	plugins: [
		progress({
			clearLine: false
		}),
		eslint({
			exclude: ['*.json', '**/*.json']
		}),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		json(),
		replace({
			'process.env.NODE_ENV': `'${process.env.BUILD_TARGET || 'development'}'`
		}),
		buble({
			transforms: {
				modules: false,
				dangerousForOf: true
			},
			objectAssign: 'Object.assign'
		}),
		(process.env.BUILD_TARGET === 'production' && uglify())
	]
}
