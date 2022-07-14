const SQLite = require('better-sqlite3');

const moduleStates = new SQLite('./_storage/moduleStates.db', { verbose: console.log });

module.exports = {
	updateState(target, newState) {
		moduleStates.prepare(`UPDATE states SET state = ${newState} WHERE uid = ?`).run(`${target.uid}.${target.node}`);
	},
	getState(target) {
		return moduleStates.prepare(`SELECT state FROM states WHERE uid = ?`).get(`${target.uid}.${target.node}`);
	},
};
