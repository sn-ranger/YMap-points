const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let contentPath = path.resolve.bind(null, __dirname);

module.exports = {
    entry: ['babel-polyfill', './src/index.js', './src/views/index.scss'],
    output: {
        path: contentPath('public'),
        filename: "./js/bundle.js"
    },
    devtool: "source-map",
    devServer: {
        contentBase: contentPath('public'),
        port: 9000,
        hot: true
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                }
            },
            {
                test: /\.js$/,
                include: contentPath('src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-runtime']
                    }
                }
            },
            {
                test: /.(sass|scss)$/,
                include: contentPath('src/views'),
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')({browsers: 'last 2 versions'})
                            ]
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: contentPath('public/index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new MiniCSSExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};