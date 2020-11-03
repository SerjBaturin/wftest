const path = require('path');

module.exports = {
    transpileDependencies: ['vuetify'],
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:7000'
            },
            '^/socket.io': {
                target: 'http://localhost:7000'
            }
        }
    },
    outputDir: path.resolve(__dirname, '..', '..', 'dist', 'client'),
    configureWebpack: {
        resolve: {
            alias: {
                '$src': path.resolve(__dirname, 'src'),
            }
        }
    }
};