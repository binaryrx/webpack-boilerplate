/* eslint-disable global-require */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env, argv) => {
    const { mode } = argv;
    require("dotenv").config({ path: path.resolve(__dirname, `.env.${mode}`) });

    return {
        entry: "./src/index.js",

        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "/",
            filename: "js/main.[contenthash].js",
        },

        mode: "development",

        devtool: mode === "development" && "eval-source-map",

        devServer: {
            host: process.env.DEV_SERVER_HOST || "localhost",
            port: 7000,
            // public: "http://localhost:7000",
            // disableHostCheck: true,
            // public: myEnv.public || "http://localhost:7000",
            overlay: {
                errors: true,
                warnings: false
            },
            // proxy: {
            //     "*": {
            //         target: "http:localhost:7000",
            //         secure: false,
            //         changeOrigin: true,
            //         autoRewrite: true,
            //         headers: {
            //             'X-ProxiedBy-Webpack': true,
            //         },
            //     }
            // },
            // open: process.env.DEV_SERVER_OPEN || false,
            writeToDisk: true,
        },

        resolve: {
            alias: {
                "@root": path.resolve(__dirname, "src"),
                "@Components": path.resolve(__dirname, "src/Components")
            },
            extensions: [".js", ".jsx", ".css", ".scss"]
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
                        "css-loader", // 3. turn css into CommonJs
                        "sass-loader", // 2. Turn scss into Css
                        "postcss-loader" // 1. prefix scss 

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

            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "src/assets/images/"),
                        to: path.resolve(__dirname, "dist/images/"),
                        globOptions: {
                            ignore: ["*.DS_Store"],
                        },
                        noErrorOnMissing: true,
                    },
                    {
                        from: path.resolve(__dirname, "src/assets/videos/"),
                        to: path.resolve(__dirname, "dist/videos/"),
                        globOptions: {
                            ignore: ["*.DS_Store"],
                        },
                        noErrorOnMissing: true,
                    },
                    {
                        from: path.resolve(__dirname, "src/assets/fonts/"),
                        to: path.resolve(__dirname, "dist/fonts/"),
                        globOptions: {
                            ignore: ["*.DS_Store"],
                        },
                        noErrorOnMissing: true,
                    },
                ],
            }),

            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),

            new MiniCssExtractPlugin({
                filename: "css/[name].css",
                chunkFilename: "css/[id].css"
            }),

            new ESLintPlugin({
                files: [".", "src", "config"],
                formatter: "table",
                emitWarning: true,
                failOnError: false
            }),

            // Prettier configuration
            new PrettierPlugin(),
            
        ],
    };
};
