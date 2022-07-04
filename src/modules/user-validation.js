// const { query } = require('express');
const md5 = require('md5');
const fs = require('fs');
const ini = require('ini');

const sysConfFile = ini.parse(fs.readFileSync('conf.dyc', 'utf-8'));

function genUserData(query) {
	var foo = sysConfFile.users[query.u];

	var user = foo.replaceAll(' ', '').split(/;|:/g);

	return user;

	console.log(user);
}

module.exports = {
	validate(query) {
		user = genUserData(query);

		if (md5(query.p) != user[1]) return false;

		return true;
	},
};
