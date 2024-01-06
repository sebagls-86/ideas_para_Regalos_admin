const path = require('path');

module.exports = {
  entry: './src/index.js', // Ruta del archivo principal de tu aplicación
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};