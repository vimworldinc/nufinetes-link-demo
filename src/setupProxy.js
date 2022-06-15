const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/vcrossServer', {
            target: 'http://172.26.2.239:8791',
            secure: false,
            changeOrigin: true,
        })
    )
}
