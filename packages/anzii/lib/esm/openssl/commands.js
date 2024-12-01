const requestCommandOptions = {
	new: { alias: "-new" },
	newkey: { alias: "-newkey" },
	x509: {
		alias: "-x509",
	},
	sha256: { alias: "-sha256" },
	days: { alias: "-days", value: true },
	["key-source"]: {
		alias: "-key",
		value: true,
	},
	["input-source"]: {
		alias: "-in",
		value: true,
	},
	outputPath: {
		alias: "-out",
		value: true,
	},

	text: { alias: "-text" },
};
const commands = {
	["generate-rsa"]: {
		commandName: "genrsa",
		options: {
			outputPath: {
				alias: "-out",
				value: true,
				default: process.cwd(),
			},
			keyBitsLength: {
				value: 2048,
			},
		},
	},
	["create-certificate-signing-request"]: {
		commandName: "req",
		options: requestCommandOptions,
	},
	["create-self-signed-certificate-request"]: {
		commandName: "req",
		options: requestCommandOptions,
	},
};

export default commands;
