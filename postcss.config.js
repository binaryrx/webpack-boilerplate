/* eslint-disable global-require */
module.exports = {
    plugins: [
        require("postcss-preset-env")({
            browsers: "last 2 versions",
        }),
    ],
};