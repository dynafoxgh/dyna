const fs = require('fs');

function getDate() {
	var foo = new Date();
	var date = `${foo.getFullYear()}-${foo.getMonth()}-${foo.getDay()}`;
	return date;
}

function getTime() {
	var foo = new Date();
	var date = `${foo.getFullYear()}-${foo.getMonth()}-${foo.getDay()}T${foo.getHours()}:${foo.getMinutes()}:${foo.getSeconds()}.${foo.getMilliseconds()}`;
	return date;
}

function writeToFile(message) {
	// fs.readFileSync(`./logs/${getDate()}.log`, 'utf-8', (err, data) => {});
	fs.writeFile(`./logs/${getDate()}.log`, `${message}\n`, err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
	});
}

module.exports = {
	log(log) {
		// console.log('test');
		message = `${getTime()} ${log}`;
		writeToFile(message);
		// console.log(message);
	},
};
