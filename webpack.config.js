const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDevelopment = false;
const isModule = true;
const name = 'testlib';
const distFolder = 'dist';

const getBuildConfig = type => {
    return {
        devServer: {
            static: {
                directory: path.resolve(__dirname, distFolder)
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
            ...(isDevelopment ? [new BundleAnalyzerPlugin()] : [])
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
                test: /\.(js|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
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

const getConfig = (type, build=false) => {
    let filename;
    let isMin = type === 'min.js';

    if(type === 'module') filename = name + '.module.js';
    else if(type === 'js') filename = name + '.js';
    else if(type === 'min.js') filename = name + '.min.js';
    else if(type === 'commonjs') filename = name + '.cjs';
    else return;

    if(type === 'js' || type === 'min.js') type = 'global';

    return {
        ...(build ? getBuildConfig(type) : {}),
        ...commonConfig,
        experiments: {
            outputModule: true
        },
        entry: {
           [filename]: path.resolve(__dirname, 'src/index.js')
        },
        output: {
            path: path.resolve(__dirname, distFolder),
            filename: '[name]',
            ...(isModule ? {
            library: {
                name: type === 'module' ? undefined : name,
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
    getConfig('module', true),
    getConfig('js'),
    getConfig('commonjs')
] : getConfig('min.js', true);
