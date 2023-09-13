const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        demo: './src/demo.js',
    },
    mode: 'production',
    output: {
        filename: 'demo.js',
        library: 'demo',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    resolve: {
        fallback: {path: false, fs: false}
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['demo'],
            // filename: "src/demo.html",
            template: "./src/demo.html",
            // inject: false,
        })
    ],
}

module.exports = async (env) => {
    return config;
}