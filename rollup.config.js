import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const dts = require('rollup-plugin-dts')

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                dir: 'dist/esm',
                format: 'esm',
            },
        ],
        plugins: [typescript()],
        external: ['aws-amplify/adapter-core'],
    },
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist/cjs',
            format: 'cjs',
        },
        plugins: [commonjs(), typescript()],
        external: ['aws-amplify/adapter-core'],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.d.ts',
                format: 'es',
            },
        ],
        plugins: [dts.default()],
        external: ['aws-amplify/adapter-core'],
    },
]
