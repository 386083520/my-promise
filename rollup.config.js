import commonjs from 'rollup-plugin-commonjs'
export default {
    input: './src/index.js',
    output: {
        file: './dist/dist.js',
        format: 'umd',
        name: 'mypromise'
    },
    plugins: [
        commonjs()
    ]
}
