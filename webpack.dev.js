const webpack = require("webpack");
const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    
    devtool: "inline-source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        open: true,
        hot: true,
        
    },

    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),
    ],
});