const { defineConfig } = require('@vue/cli-service')
const Dotenv = require('dotenv-webpack');
const jQueryPath = 'jquery/dist/jquery.js';
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      require('unplugin-vue-components/webpack')({ deep: true, directoryAsNamespace: false }),
      new Dotenv(),
      new webpack.ProvidePlugin({
        jQuery: jQueryPath,
        $: jQueryPath,
        'window.jQuery': jQueryPath,
      }),
    ],
  },
  devServer: {
    host: "localhost"
  }
});