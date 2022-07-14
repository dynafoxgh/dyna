module.exports = {
	generateModuleConfiguration(modConfFile) {
		function convertToJSON(object) {
			foo = {};
			Object.keys(object).forEach(key => {
				baz = {};
				bar = object[key].replaceAll(' ', '').split(/;|:/g);

				for (let i = 0; i < bar.length / 2; i++) {
					baz[bar[2 * i]] = bar[2 * i + 1];
				}
				foo[key] = baz;
				// log(`${foo[key]}`);
				console.log(`Found configuration for ${key} with ${JSON.stringify(foo[key])}`);
			});
			return foo;
		}
		// log(`Generating module configuration...`);
		console.log(`Generating module configuration...`);

		const modConf = {
			conf: convertToJSON(modConfFile.conf),
			list: convertToJSON(modConfFile.list),
		};

		console.log(modConf);

		return modConf;
	},
};
