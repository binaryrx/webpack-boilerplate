const path = require("path");
const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "production",

    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
    },

    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
        // instead of having their own. This also helps with long-term caching, since the chunks will only
        // change when actual code changes, not the webpack runtime.
        runtimeChunk: {
            name: "runtime",
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});