import commonjs from 'rollup-plugin-commonjs'
export default {
    input: './src/core.js',
    output: {
        file: './dist/dist.js',
        format: 'umd',
        name: 'mypromise'
    },
    plugins: [
        commonjs()
    ]
}
