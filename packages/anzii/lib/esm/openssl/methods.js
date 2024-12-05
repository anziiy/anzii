import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import commands from "./commands.js";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const init = function () {
	console.log("THE OPENSSL has been initialised");
	this.listens({
		"create-ssl-certificate": this.handleCreateSSLCert.bind(this),
	});
};

// eslint-disable-next-line no-unused-vars
export const handleCreateSSLCert = function (data) {
	// eslint-disable-next-line no-unused-vars
	const self = this;
	const { payload } = data;
	const { config, sslConfigPath = "" } = payload;
	const filesOutputPaths = {};

	if (!config?.action && !config?.actions) {
		throw new Error(
			"Openssl config requires config.action or config.actions to be defined",
		);
	}
	let options = "";
	if (config?.actions) {
		let terminalPromises = config.actions.map(async (configItem, loop) => {
			options = self.runOptions(configItem);
			console.log("Actions options built string", options);
			filesOutputPaths[options.output.type] = options.output.value;
			return await runTerminal(
				`openssl ${options.commandString}`,
				configItem.action,
				sslConfigPath,
			);
		});

		Promise.all(terminalPromises)
			.then((opensslActionsResults) => {
				console.log("The promises have finished", opensslActionsResults);
				data.callback({
					actionStatus: true,
					message: "Self-signed certificated greated sucessfully",
					filesOutputPaths,
				});
			})
			.catch((err) => {
				console.log("SSL KEY CREATION FAILED", err);
				data.callback({
					actionStatus: false,
					error: err,
					message: "Certification createion failed",
				});
			});

		// async.waterfall([self.readHostsFile.bind(self)], (err, result) => {
		// 	console.log("THE WATERALL RESULTS", result);
		// 	resolve(result);
		// });
	} else {
		options = self.runOptions(config);
		filesOutputPaths[options.output.type] = options.output.value;
		self
			.runTerminal(`openssl ${options.commandString}`)
			.then((outcome) => {
				data.callback({
					actionStatus: true,
					message: "Self-signed certificate created sucessfully",
					filesOutputPaths,
				});
			})
			.catch((err) => {
				data.callback({
					actionStatus: false,
					error: err,
					message: "Certification createion failed",
				});
			});
	}
};

/**
 *
 * @param {*} commandr
 * runTerminal will take a command string that is made up of the openssl parent command
 *  and its related applicable sub-comands. The sub-commands will have options of their own
 */
export const runTerminal = function (
	commandToRun,
	action = "",
	sslConfigPath = null,
) {
	return new Promise(async (resolve, reject) => {
		console.log("THE ACTION", action);
		let commandToRunModified = `${
			action === "create-certificate-signing-request"
				? `${commandToRun} -config ${sslConfigPath}`
				: commandToRun
		}`;
		console.log("THE COMMAND TO RUN MODIFIED", commandToRunModified);
		execSync(commandToRunModified, {
			cwd: process.cwd(),
			stdio: "inherit",
		});
		resolve(true);
	});
};

/**
 *
 * @param {*} config
 * @returns String
 *
 * runOptions is used to process options set for all the different sub-commands of openssl
 */
export const runOptions = function (config) {
	const self = this;
	// console.log("THE COMMANDS", commands);

	// Throw if config action is not by supported by this plugin
	if (!commands[config.action]) {
		throw new Error(
			"Openssl config contains command that is not yet supported",
		);
	}
	let command = commands[config.action];
	let configActionOptions = config.options;
	let terminalOptionsFromConfig = "";
	let commandOptionsKeys = Object.keys(command.options); // get command options for the current action
	let fileOutput = {};
	// console.log("THE COMMAND", command);
	// console.log("Command KEYS", commandOptionsKeys);

	// Loop through each option
	commandOptionsKeys.forEach((option) => {
		// console.log("The option", option);
		// console.log("The command ", command.options);
		// console.log("THE COMMNAD.OPTIONS.option", command.options[option]);
		let commandOption = command.options[option];
		// console.log("THE CONFIG ACTIONS", configActionOptions);
		if (!configActionOptions[option]) {
			// console.log("THE OPTION IS NOT IN ACTION", option);
			if (command?.shouldDefault) {
				if (commandOption?.alias) {
					terminalOptionsFromConfig += `${commandOption.alias} ${commandOption.value} `;
				} else {
					terminalOptionsFromConfig += `${commandOption.value} `;
				}
			}
		} else {
			// console.log("THE CONFIG ACTIONS", configActionOptions);
			if (commandOption?.alias) {
				if (commandOption?.value) {
					if (
						option == "key-source" ||
						option == "input-source" ||
						option == "outputPath"
					) {
						if (!path.isAbsolute(option)) {
							if (option == "outputPath")
								self.setActionOutput(
									fileOutput,
									config.action,
									path.resolve(process.cwd(), configActionOptions[option]),
								);
							terminalOptionsFromConfig += `${
								commandOption.alias
							} ${path.resolve(process.cwd(), configActionOptions[option])} `;
						}
					} else {
						if (option == "outputPath")
							self.setActionOutput(
								fileOutput,
								config.action,
								configActionOptions[option],
							);
						terminalOptionsFromConfig += `${commandOption.alias} ${configActionOptions[option]} `;
					}
				} else {
					terminalOptionsFromConfig += `${commandOption.alias} `;
				}
			} else {
				terminalOptionsFromConfig += `${configActionOptions[option]} `;
			}
		}
	});
	// console.log("TERMINAL OPTIONS FROM CONFIG", terminalOptionsFromConfig);

	return {
		commandString: `${
			commands[config.action].commandName
		} ${terminalOptionsFromConfig}`,
		output: fileOutput,
	};
};

/**
 *
 * @param {*} commandr
 * runTerminal will take a command string that is made up of the openssl parent command
 *  and its related applicable sub-comands. The sub-commands will have options of their own
 */
export const setActionOutput = function (outputHolder, action, value) {
	const self = this;
	switch (action) {
		case "create-self-signed-certificate-request":
			outputHolder["value"] = value;
			outputHolder["type"] = "certificate";
			break;
		case "create-certificate-signing-request":
			outputHolder["value"] = value;
			outputHolder["type"] = "csr";
			break;
		case "generate-rsa":
			outputHolder["value"] = value;
			outputHolder["type"] = "key";
			break;
		default:
			null;
	}
};
