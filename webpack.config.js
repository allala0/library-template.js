const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isModuleByDefault = false;

const name = 'testlib';
const buildDirectory = 'build';
const isDevelopment = false;
const useBundleAnalyzerInDevelopmentMode = false;

const isWeb = process.argv.indexOf('web') > -1;
const isModule = process.argv.indexOf('module') > -1 || !isWeb && isModuleByDefault;

const getHtmlConfig = type => {
    return {
        devServer: {
            static: {
                directory: path.resolve(__dirname, buildDirectory)
            },
            port: 3000,
            open: true,
            hot: true,
            compress: true,
            historyApiFallback: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'webpack-app',
                filename: 'index.html',
                template: 'src/template.html',
                inject: type !== 'module',
                ...(type === 'module' ?{scriptLoading: 'module'} : {})
            }),
            ...(isDevelopment && useBundleAnalyzerInDevelopmentMode ? [new BundleAnalyzerPlugin()] : [])
        ]
    }
};

const commonConfig = {
    ...(isDevelopment ? {devtool: 'source-map'} : {}),
    mode: isDevelopment ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(js|cjs|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    }
};

const getConfig = (type) => {
    let filename = name;
    let isMin = type === 'min.js';
    let ext;

    if(type === 'module') ext = '.module.js';
    else if(type === 'js') ext = '.js';
    else if(type === 'min.js') ext = '.min.js'
    else if(type === 'commonjs') ext = '.cjs';
    else return;

    if(type === 'js' || type === 'min.js') type = 'global';

    return {
        ...commonConfig,
        ...(!isModule ? getHtmlConfig(type) : {}),
        ...(type === 'module' ?{experiments: {
            outputModule: true
        }} : {}),
        entry: {
           [filename]: path.resolve(__dirname, 'src/index.js')
        },
        output: {
            path: path.resolve(__dirname, buildDirectory),
            filename: '[name]' + (isDevelopment ? '[contenthash]' : '') + ext,
            ...(isModule ? {
            library: {
                ...( type === 'module' ? {} : {name: name}),
                type: type
            },
            } : {})
        },
        optimization: {
            minimize: isMin
        }
    }
}

module.exports = isModule ? [
    getConfig('min.js'),
    getConfig('module'),
    getConfig('js'),
    getConfig('commonjs')
] : getConfig('min.js');
