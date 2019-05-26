module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: __dirname + "/dist/",
        filename: 'live-client.js'
    }/*,
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }]
    }*/
}
