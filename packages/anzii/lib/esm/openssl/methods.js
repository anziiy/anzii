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
	const { config } = data;

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
			return await runTerminal(`openssl ${options}`, loop);
		});

		Promise.all(terminalPromises)
			.then((opensslActionsResults) => {
				console.log("The promises have finished", opensslActionsResults);
				data.callback({
					actionStatus: true,
					message: "Self-signed certificated greated sucessfully",
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
		self
			.runTerminal(`openssl ${options}`)
			.then((outcome) => {
				data.callback({
					actionStatus: true,
					message: "Self-signed certificated greated sucessfully",
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
export const runTerminal = function (commandToRun, loop) {
	return new Promise(async (resolve, reject) => {
		execSync(`${commandToRun}`, {
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
							terminalOptionsFromConfig += `${
								commandOption.alias
							} ${path.resolve(process.cwd(), configActionOptions[option])} `;
						}
					} else {
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

	return `${commands[config.action].commandName} ${terminalOptionsFromConfig}`;
};

/**
 *
 * @param {*} commandr
 * runTerminal will take a command string that is made up of the openssl parent command
 *  and its related applicable sub-comands. The sub-commands will have options of their own
 */
export const getAsyncFunk = function (commandr) {
	const self = this;
	return async () => {
		self.runTerminal(commandr).then((runOutcom) => {
			console.log("RUN OUTCOME FOR COMMANDR", commandr, "outcome", runOutcom);
			resolve(runOutcom);
		});
	};
};
