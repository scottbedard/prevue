import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json');

export default {
    input: `src/index.ts`,
    external: [],
    output: [
        { 
            file: pkg.module, 
            format: 'es', 
            sourcemap: true,
        },
    ],
    plugins: [
        // Allow json resolution
        json(),
        
        // Compile TypeScript files
        typescript({
            tsconfigOverride: {
                compilerOptions: {                        
                    module: 'es2015',
                    target: 'es2015',
                }
            },
            useTsconfigDeclarationDir: true,
        }),

        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),

        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),

        // Resolve source maps to the original source
        sourceMaps(),
    ],
    watch: {
        include: 'src/**',
    },
}
