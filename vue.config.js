module.exports = {
  devServer: {
    port: 8090
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.ts',
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: false,
      customFileProtocol: './',
      nodeModulesPath: ['../node_modules', './node_modules']
    }
  },
  pages: {
    index: {
      entry: 'src/renderer/main.ts',
      templaet: 'public/index.html',
      filename: 'index.html'
    }
  }
}
