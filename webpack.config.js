const path = require("path");

module.exports = {
    entry: "./src/home.js",
    devtool: "inline-source-map",
    target: "web",

    devServer: {
        contentBase: "./src"
    },
    output: {
        path: path.resolve(__dirname, "src"),
        filename: "home.js"
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ],
    }
};