const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const ini = require('ini');
const fs = require('fs');

const dys = require('./modules/dys');

const config = ini.parse(fs.readFileSync('./conf.dyc', 'utf-8'));

app.use(bodyParser.json());

app.listen(config.network.port, () => console.log(`Listening at http://localhost:${config.network.port}`));

app.get('/api/', (req, res) => {
	res.status(200).send({
		status: 'OK',
	});
});

app.post('/api/:version/:userHash', (req, res) => {
	dys.handleRequest(req);
	// var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	// const { version, userHash } = req.params;
	// const data = req.body;

	// console.log(ip);

	res.send({
		status: 'OK',
	});
});
