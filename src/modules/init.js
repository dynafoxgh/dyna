const fs = require('fs');
const ini = require('ini');
const dys = require('./dys');

module.exports = () => {
	time = new Date().getTime();
	const config = ini.parse(fs.readFileSync('./conf.dyc', 'utf-8'));
	// console.log(config);

	// dys.read(fs.readFileSync(config.files.map, 'utf-8'));

	console.log(`Compiled in: ${new Date().getTime() - time} ms`);

	// console.log();
};
