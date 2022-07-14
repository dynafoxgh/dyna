// -- IMPORTS --

// dependencies
const fs = require('fs');
const ini = require('ini');
const axios = require('axios');

// configuration files
const systemConf = ini.parse(fs.readFileSync('conf.dyc', 'utf-8'));
// const moduleConfFile = ini.parse(fs.readFileSync('./config/module-configuration.dyc', 'utf-8'));
const modules = require('../config/module-configuration.json');

// libraries
const modProp = require('../libs/moduleProperties.json');

// system dependecies
const userVal = require('./user-validation');
const scripts = require(`..${systemConf.files.scripts}`);
const load = require('./load');
const dbh = require('./databaseHandler');

// -- GLOBAL FUNCTIONS --
function init() {
	// const modules = load.generateModuleConfiguration(moduleConfFile);
	// load.verifyModuleConfiguration(modules);
	return modules;
}

module.exports = {
	init() {
		// try {
		// 	modules = init();
		// } catch (error) {
		// 	console.log(error);
		// }
	},

	internalRequest(body, params, query) {
		// console.log(params);
		// console.log(query);
		// console.log(body);

		if (modules[query.uid].nodes[body.node].switchType == 'mono') {
			if (dbh.getState(modules[query.uid].nodes[body.node].target).state == '1') {
				state = '0';
			} else {
				state = '1';
			}
		}

		axios
			.put(
				`http://${modules[modules[query.uid].nodes[body.node].target.uid].ip}/control?node=${
					modules[query.uid].nodes[body.node].target.node
				}&state=${state}`
			)
			.then(result => resolve(result))
			.catch(err => console.log('error'));
	},

	updateIO(body, params, query) {
		// dbh.updateState(`${query.uid}.${body.node}`, body.newState);
		dbh.updateState({ uid: query.uid, node: body.node }, body.newState);
	},
};
