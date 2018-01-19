var webpack = require('webpack');

module.exports = {
  entry: ['./src/main.js'],
  output: {
    filename: './dist/build.js'
  },
  resolve: {
		alias: {
			'jquery': 'jquery/dist/jquery.js'
		}
	}
}
