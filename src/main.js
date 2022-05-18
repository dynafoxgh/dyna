const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const ini = require('ini');

app.use(bodyParser.json());

const PORT = 3000;
const config = ini.parse(fs.readFileSync('./configuration.dys', 'utf-8'));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

console.log(config);

app.get('/api/', (req, res) => {
	res.status(200).send({
		status: 'OK',
	});
});

// app.get('/redirect/:id', (req, res) => {
// 	const { id } = req.params;

// 	if (id == 'test') {
// 		res.redirect(301, 'https://google.com');
// 	}
// });
//window.location.replace(...)

app.post('/api/:version/:userHash', (req, res) => {
	const { version, userHash } = req.params;
	const data = req.body;

	//I0000-00

	console.log(data);

	res.send({
		version,
		userHash,
	});
});

/*
dyna
|
|\ .server
\   configuration.dys
    map.dys



*/
