// -- IMPORTS --

// dependencies
const fs = require('fs');
const ini = require('ini');

// configuration files
const sysConfFile = ini.parse(fs.readFileSync('conf.dyc', 'utf-8'));
const modConfFile = ini.parse(fs.readFileSync('./config/module-configuration.dyc', 'utf-8'));

// libraries
const modProp = require('../libs/moduleProperties.json');

// system dependecies
const userVal = require('./user-validation');
const scripts = require(`..${sysConfFile.files.scripts}`);

// -- GLOBAL FUNCTIONS --
function validateModConf(conf) {
	validModConf = true;
}

function genModConf() {
	// log(`Generating module configuration...`);
	console.log(`Generating module configuration...`);
	foo = {};
	Object.keys(modConfFile.conf).forEach(key => {
		baz = {};
		bar = modConfFile.conf[key].replaceAll(' ', '').split(/;|:/g);

		for (let i = 0; i < bar.length / 2; i++) {
			baz[bar[2 * i]] = bar[2 * i + 1];
		}
		foo[key] = baz;
		// log(`${foo[key]}`);
		console.log(`Found configuration for ${key} with ${JSON.stringify(foo[key])}`);
	});
	const modConf = foo;

	console.log(modConf);

	fs.writeFile('./_storage/modConf.json', JSON.stringify(modConf), err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
	});

	return modConf;
}

module.exports = {
	init() {
		try {
			modConf = genModConf();
			validateModConf(modConf);
		} catch (error) {
			console.log(error);
		}

		Object.keys(modConf).forEach(element => {
			console.log(`${element}: \n${JSON.stringify(modConf[element])}`);
			// POST data to modules when parts arrive
		});

		return false;
	},

	handleRequest(body, params, query) {
		console.log(body);
		console.log(params);
		console.log(query);
		// console.log(modConf);

		// if (!userVal.validate(query)) return console.log('WARNING - invalid user');

		if (!(body.id in modConf)) return console.log('ERROR - request did not have target id');

		console.log(modProp.moduleTypes[modConf[body.id].moduleType]);

		Object.keys(body.data).forEach(item => {
			console.log(item);
			console.log(body.data[item]);
			console.log(modProp.moduleTypes[modConf[body.id].moduleType][item]);
			if (!String(body.data[item]).match(new RegExp(modProp.moduleTypes[modConf[body.id].moduleType][item], 'i'))) {
				return console.log('invalid');
			}
		});

		if (body.requestType == 'function') {
			if ('device' in body) {
				scripts.exec(body.device);
			} else {
				console.log(`REQUEST FAILED - body did not have 'device'`);
			}
		}
	},

	internalRequest(body, params, query) {
		console.log(body);
		console.log(params);
		console.log(query);

		if (!(body.id in modConf)) return console.log('ERROR - request did not have target id');

		data = modConf[modConf[body.id].target];

		console.log(data);
	},
};
