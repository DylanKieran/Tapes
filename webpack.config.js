const path = require("path");

module.exports = {
    entry: "./src/index.js",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./src"
    },
    output: {
        path: path.resolve(__dirname, "src"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};