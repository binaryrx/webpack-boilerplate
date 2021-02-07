const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin  = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    
    entry: "./src/index.js",

    resolve: {
        extensions: ["*", ".js", ".jsx"],
        alias: {
            "#": path.resolve(__dirname, "src")
        }
    },
    module: {
        rules: [
            //  config for es6 jsx 
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            //  config for scss compilation
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // 3. injects styles into DOM
                        options: {
                            publicPath: "../"
                        }
                    },  
                    "css-loader", // 2. turns css into CommonJs
                    {
                        loader: "sass-loader" // 1. Turns scss into Css
                    }
                ]
            },
            //  config for images
            {
                test: /\.(ico|png|svg|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "images",
                        }
                    }
                ]
            },
            //  config for videos
            {
                test: /\.(mp4|avi|mkv|mov)/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[ext]"
                        } 
                    }
                ]
            },
            //  config for fonts
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                exclude: /images/,
                use: [
                    {
                        loader: "file-loader", 
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts",
                        }
                    }
                ]
            },
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["*.*", "css/*.*", "js/*.*", "fonts/*.*", "images/*.*"]
        }),

        new CopyWebpackPlugin ({
            patterns: [
                { 
                    from: path.resolve(__dirname, "src/assets/images/"),
                    to: path.resolve(__dirname, "dist/images/"),
                    globOptions: {
                        ignore: ["*.DS_Store"],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),

        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),

        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        }),

        new ESLintPlugin({
            files: [".", "src", "config"],
            formatter: "table",
        }),
      
        // Prettier configuration
        new PrettierPlugin(),
        
    ],
};
