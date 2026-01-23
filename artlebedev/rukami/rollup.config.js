import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import modify from 'rollup-plugin-modify'
import pkg from './package.json';

const date = new Date();
const banner = `/**
 * ${ pkg.name } v${ pkg.version } build ${ date.toUTCString() }
 * ${ pkg.homepage }
 * Copyright ${ date.getUTCFullYear() } ${ pkg.author.name }
 * @license ${ pkg.license }
 */`;

const BUILD_FOLDER = 'build/ts';

// const external = Object.keys(pkg.peerDependencies);
// const globals = Object.assign({}, ...external.map((value) => ({
//   [value]: value.replace(/-/g, '').toUpperCase()
// })));

export default [
  {
    input: 'src/rukami.ts',
    output: [
      {
        file: 'build/rukami.js',
        format: 'umd',
        name: 'Rukami',
        sourcemap: true,
        // globals,
        banner
      }
    ],
    // external,
    watch: true,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        outDir: BUILD_FOLDER
      }),
      modify({
        find: /["'][.\/a-z]+three\.module\.js["']/g,
        replace: '"three"'
      })
    ]
  },
  {
    input: 'src/rukami.ts',
    // external,
    output: [
      {
        file: 'build/rukami.min.js',
        format: 'umd',
        name: 'Rukami',
        banner,
        plugins: [
          terser({
            keep_classnames: false,
            keep_fnames: false,
            output: {
              comments: /Senya Pugach/ig,
            }
          })
        ]
      }
    ],
    watch: false,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        outDir: BUILD_FOLDER
      }),
      modify({
        find: /["'][.\/a-z]+three\.module\.js["']/g,
        replace: '"three"'
      })
    ]
  }
];