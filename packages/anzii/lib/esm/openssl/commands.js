const commands = {
	["generate-rsa"]: {
		commandName: "genrsa",
		options: {
			outputPath: {
				alias: "-out",
				value: process.cwd(),
			},
			keyBitsLength: {
				value: 2048,
			},
		},
	},
};

export default commands;
