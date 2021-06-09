
import webpack from 'webpack';
import dotenv from 'dotenv';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

// Set up environment variables to send forward to react
dotenv.config();

// Helper function
const resolvePath = (p) => path.resolve(p ? `${__dirname}${p}` : __dirname);

module.exports = {
    stats: {
        modules: false,
        chunks: false,
        colors: true,
        builtAt: true,
        children: false
    },
    entry: [
        resolvePath('/front/index.jsx'),
        resolvePath('/front/assets/scss/index.scss')
    ],
    output: {
        path:  resolvePath('/build'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    resolve: {
        // Add `.jsx` and `.js` as a resolvable extension.
        extensions: ['.jsx', '.js']
    },
    
    module: {
        rules: [
            {
                test: /.(js|jsx)?$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                    },
                    'sass-loader'
                ],
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: "./assets/images/[name].[ext]"
                }
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader',
            }
        ]
    },
    
    plugins: [
        // Set environment variables
        new webpack.DefinePlugin({
            'process.env': { 
                API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                PORT: JSON.stringify(process.env.PORT),
                HOST: JSON.stringify(process.env.HOST),
            }
        }),

        // Turn off react devTools console message for all envs
        new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
        }),

        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
        }),

        new HtmlWebpackPlugin({
            template: resolvePath('/front/template/index.html'),
            inject: 'body',
            hash: true,
            xhtml: true,
        })
    ]
 };
