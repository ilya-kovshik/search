const path = require("path");

module.exports = {
    devtool: "source-map",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")]
            },
            {
                test: /\.less$/,
                use: [ 
                    'style-loader', 
                    'css-loader', 
                    'less-loader'
                ],
                include: [path.resolve(__dirname, "src")]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        publicPath: "public",
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    devServer: {
        publicPath: "/",
        open: true,
        contentBase: './public',
        hot: true
    }
}