module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['babel-plugin-root-import', {
      paths: [{
        rootPathPrefix: '~',
        rootPathSuffix: 'src',
      }]
    }],
    ["@babel/plugin-proposal-decorators", {
      legacy: true,
    }],
  ]
}
