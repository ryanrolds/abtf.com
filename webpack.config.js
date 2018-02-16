const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './public/lib/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/js/'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components|public)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', 'react']
					}
				}
			}
		]
	}
};
