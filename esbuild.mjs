import * as esbuild from 'esbuild'
import { copy } from 'esbuild-plugin-copy';

await esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: './.publish/index.js',
    target: ['es2020', 'node12'],
    platform: 'node',
    packages: 'external',
    define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    },
    plugins: [
        copy({
            resolveFrom: 'cwd',
            assets: {
                from: ['./package.json'],
                to: ['./.publish/package.json'],
            },
        }),
    ],
});
