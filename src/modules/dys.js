const fs = require('fs');

const map = JSON.parse(fs.readFileSync('./config/map.dys', 'utf-8'));

module.exports = {
	handleRequest(req) {
		const data = req.body;

		console.log(map.conf[req.body.origin]);
		console.log(data);
		// origin = req.socket.remoteAddress.split(':').pop();
	},
};
