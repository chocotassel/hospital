module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://localhost:443',
        changeOrigin: true,
      }
    }
  }
}
