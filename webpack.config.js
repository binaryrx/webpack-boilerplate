/* eslint-disable global-require */
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin  = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const chokidar = require("chokidar");

module.exports = (env,argv) => {
    const { mode } = argv;

    require("dotenv").config({ path: path.resolve(__dirname, `.env.${mode}`) });
    const myEnv = {};

    // eslint-disable-next-line no-restricted-syntax
    for(const p in process.env) {
        if(/^MY_APP_/.test(p)) {
            myEnv[p] = JSON.stringify(process.env[p]);
        }
    }

    return {
        entry: "./src/index.js",

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "main.[contenthash].js",
        },

        mode: "development",

        devtool: mode === "development" && "eval-source-map",
        
        devServer: {
            before(app,server){
                chokidar.watch([
                    "./**/*.php",
                    "./*.php",
                ],{
                    ignoreInitial: true
                }).on("all",() => {
                    server.sockWrite(server.sockets, "content-changed");
                });
            },
            host: process.env.DEV_SERVER_HOST || "localhost",
            port: process.env.DEV_SERVER_PORT,
            overlay: {
                errors: true,
                warnings: false
            },
            open: process.env.DEV_SERVER_OPEN || false,
            writeToDisk: true,
            proxy: {
                "*": {
                    target: process.env.DEV_SERVER_PROXY_TARGET,
                    secure: false,
                    changeOrigin: true,
                    autoRewrite: process.env.DEV_SERVER_PROXY_REWRITE,
                    headers: {
                        "X-ProxiedBy-Webpack": true,
                    },
                }
            }
        },

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
            new webpack.DefinePlugin(myEnv),

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
                template: "./src/index.php",
                filename: "index.php"
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
};
