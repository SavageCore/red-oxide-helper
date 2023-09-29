const path = require('node:path');
const {UserscriptPlugin} = require('webpack-userscript');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
	mode: dev ? 'development' : 'production',
	entry: './src/index.js',
	output: {
		filename: 'main.user.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [new UserscriptPlugin({
		headers: {
			name: 'red-oxide-helper',
			namespace: 'https://savagecore.uk',
			version: '0.1.0',
			description: 'Add red_oxide links [RO] to RED',
			author: 'SavageCore',
			include: [
				'http*://redacted.ch/artist.php*',
				'http*://redacted.ch/better.php*',
				'http*://redacted.ch/collages.php*',
				'http*://redacted.ch/torrents.php*',
			],
			grant: [
				'GM_setClipboard',
				'GM.setClipboard',
			],
			require: [
				'https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js',
			],
			'run-at': 'document-idle',
		},
	})],
	resolve: {
		fallback: {
			http: require.resolve('stream-http'),
			https: require.resolve('https-browserify'),
			stream: require.resolve('stream-browserify'),
			zlib: require.resolve('browserify-zlib'),
			buffer: require.resolve('buffer'),
		},
	},
	target: 'web',
};
