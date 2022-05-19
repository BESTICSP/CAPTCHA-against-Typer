module.exports = {
	presets: [
		'es2016',
		'stage-2'
	],
	plugins: [
		'transform-regenerator',
		['transform-react-jsx', { pragma:'h' }]
	]
};
