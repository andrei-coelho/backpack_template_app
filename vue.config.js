module.exports = {

    pages: {
        
        index: 'src/pages/home.js',

        home: {
            optimization: {
                splitChunks: {
                  chunks: 'all',
                },
              },
            entry:    'src/pages/home.js',
            template: 'public/home.html',
            filename: 'home.html',
            chunks: ['chunk-vendors', 'chunk-common', 'home', 'vendor']
        },
        
    },


    publicPath: process.env.NODE_ENV === 'development' ? '' : '{__URL__}',

}