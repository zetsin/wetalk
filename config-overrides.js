const path = require('path')
const { injectBabelPlugin, paths } = require('react-app-rewired')

module.exports = (config, env) => {
  config = injectBabelPlugin(['import', [{
    libraryName: '@material-ui/core',
    libraryDirectory: '',
    camel2DashComponentName: false
  }, {
    libraryName: '@material-ui/icons',
    libraryDirectory: '',
    camel2DashComponentName: false
  }]], config)

  if (env === "production") {
    const webpackPaths = require(paths.scriptVersion + "/config/paths")
    webpackPaths.appBuild = config.output.path = path.resolve(__dirname, 'www')
  }

  return config
}