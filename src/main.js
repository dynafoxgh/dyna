const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const ini = require('ini');
const fs = require('fs');

const dys = require('./modules/dys');

const config = ini.parse(fs.readFileSync('./conf.dyc', 'utf-8'));

app.use(bodyParser.json());

app.listen(config.network.port, () => console.log(`Listening at http://localhost:${config.network.port}`));

dys.init();

app.get('/api/', (req, res) => {
	res.status(200).send({
		status: 'OK',
	});
});

app.put('/api/:system', (req, res) => {
	// var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	console.log(req.params);

	if (req.params.system == 'internal') dys.internalRequest(req.body, req.params, req.query);

	if (req.params.system == 'v0') dys.handleRequest(req.body, req.params, req.query);

	res.send({
		status: 'OK',
	});
});
