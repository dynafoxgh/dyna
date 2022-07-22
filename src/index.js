const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const ini = require('ini');
const fs = require('fs');

const dys = require('./modules/dys');

const localRequest = require('./handlers/localRequest');

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
	if (req.params.system == 'local') localRequest.run(req.body, req.params, req.query);
	// if (req.params.system == 'v0') dys.handleRequest(req.body, req.params, req.query);
	res.send({
		status: 'OK',
	});
});

app.put('/api/data/:type', (req, res) => {
	if (req.params.type == 'io') dys.updateIO(req.body, req.params, req.query);
	// if (req.params.system == 'v0') dys.handleRequest(req.body, req.params, req.query);
	res.send({
		status: 'OK',
	});
});

app.get('/api/data/:system', (req, res) => {
	console.log(req.params);

	// if (req.params.system == 'get-data') dys.dataRequest(req.body, req.params, req.query, res);
});
