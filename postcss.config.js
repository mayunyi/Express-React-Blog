// module.exports = {
//   parser: 'sugarss',
//   plugins: {
//     // require('postcss-import'),
//     // require('postcss-cssnext'),
//     require('autoprefixer')(),
//     // require('cssnano')()
//   }
// }

module.exports = {
    plugins: [
        require('autoprefixer')({
            "browsers": [
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        })
    ]
};