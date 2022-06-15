const webpack = require('webpack')
const rewireStyledComponents = require('react-app-rewire-styled-components')
const TerserPlugin = require('terser-webpack-plugin')

const supportMjs = () => (webpackConfig) => {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
    })
    return webpackConfig
}

const {
    useBabelRc,
    override,
    addWebpackPlugin,
    addWebpackAlias,
    fixBabelImports,
    addLessLoader,
    addWebpackExternals,
    addWebpackModuleRule,
    addBabelPlugin,
    overrideDevServer,
    watchAll,
} = require('customize-cra')

const env = process.env.BABEL_ENV
const react_env = process.env.REACT_APP_ENV

const rewireStyledComponentsPlugin = (config) => {
    config = rewireStyledComponents(config, {
        ssr: false,
        displayName: env === 'development',
    })

    return config
}

const optimizeChunks = (config) => ({
    ...config,
    optimization: {
        ...config.optimization,
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'all',
                    name: 'vendor',
                },
                default: {
                    minSize: 0,
                    minChunks: 2,
                    reuseExistingChunk: true,
                    name: 'utils',
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                        drop_console: true,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: 2,
                cache: true,
                sourceMap: false,
                extractComments: false,
            }),
        ],
    },
})

const path = require('path')

module.exports = {
    webpack: override(
        addBabelPlugin('react-hot-loader/babel'),
        addWebpackAlias({
            '@': path.join(__dirname, './src'),
        }),
        useBabelRc(),

        rewireStyledComponentsPlugin,
        optimizeChunks,
        fixBabelImports('import', {
            libraryDirectory: 'es',
            style: true,
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: {'@primary-color': '#1657d2'},
        }),
        addWebpackModuleRule({
            test: /\.worker\.js$/,
            use: {loader: 'worker-loader'},
        }),
        addWebpackExternals({
            // jquery: 'jQuery',
            // lodash: '_',
            // THREE: 'THREE',
            // POSTPROCESSING: 'POSTPROCESSING',
            Compressor: 'Compressor',
            // klinecharts: 'klinecharts',
            // echarts: 'echarts',
            // TCaptcha: 'TencentCaptcha',
        }),
        react_env === 'test' || react_env === 'prod' ? addWebpackPlugin(new webpack.IgnorePlugin(/^usb$/)) : '',
        addWebpackPlugin(new webpack.ProvidePlugin({Buffer: ['buffer', 'Buffer']})),
        supportMjs()
    ),
    devServer: overrideDevServer(watchAll()),
}
