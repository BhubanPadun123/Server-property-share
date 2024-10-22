const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './server.js', // Adjust this based on your actual entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.json', '.ts', '.jsx'],
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": false,   // Disable polyfill for `fs` module (if not needed)
            "crypto": false, // Disable or replace with 'crypto-browserify' if needed
            "stream": false, // Disable or replace with 'stream-browserify' if needed
            "assert": false,
            "process": false,
            "buffer": false,
            "url": false,
            "util": false,
            "os": false,
            "tls": false,
            "net": false,
            "dns": false,
            "child_process": false,
            "zlib": false,
            "https": false,
            "http": false,
            "timers": false,
            "timers": false,
            "timers": false,
            "nock": false,
            'aws-sdk': false,
            "querystring": false,
            'mock-aws-s3': false,
            'node-gyp': false,
            'npm': false,
            'async_hooks': false,

        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // Add other loaders if necessary
        ],
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /\.html$/,
        }),
    ],
};
