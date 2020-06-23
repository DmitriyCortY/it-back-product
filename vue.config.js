module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    publicPath: '/wp-content/themes/totonis/constructor/back/product/dist/',
    chainWebpack: config => {
        config.plugins.delete('prefetch');
    }
}