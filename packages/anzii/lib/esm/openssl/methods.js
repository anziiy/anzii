import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import commands from "./commands.js";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const init = function () {
	console.log("THE OPENSSL has been initialised");
	this.listens({
		"create-ssl-cert": this.handleCreateSSLCert.bind(this),
	});
};

// eslint-disable-next-line no-unused-vars
export const handleCreateSSLCert = function (data) {
	// eslint-disable-next-line no-unused-vars
	const self = this;
	const pao = self.pao;
	const getRootDir = pao.pa_getRootDir;

	const loadFile = pao.pa_loadFile;
	let thisFileDir = getRootDir(__filename);
	loadFile(path.resolve(thisFileDir, "generateConfig_.json")).then(
		(sslConfig) => {
			console.log("SSL CONFIG", sslConfig);

			let config = JSON.parse(sslConfig);

			// Throw if no config.action or config.options is not defined in the loaded json config
			if (!config?.action && !config?.actions) {
				throw new Error(
					"Openssl config requires config.action or config.actions to be defined",
				);
			}
			let options = "";
			if (config?.actions) {
				config.actions.forEach((configItem) => {
					console.log("THE CONFIG ITEM", configItem);
					options = self.runOptions(configItem);
					console.log("Actions options built string", options);
					self.runTerminal(`openssl ${options}`);
				});
				// async.waterfall([self.readHostsFile.bind(self)], (err, result) => {
				// 	console.log("THE WATERALL RESULTS", result);
				// 	resolve(result);
				// });
			} else {
				options = self.runOptions(config);
				self.runTerminal(`openssl ${options}`);
			}
		},
	);
};

/**
 *
 * @param {*} commandr
 * runTerminal will take a command string that is made up of the openssl parent command
 *  and its related applicable sub-comands. The sub-commands will have options of their own
 */
export const runTerminal = function (commandr) {
	let commandToRun = `${commandr}`;
	console.log("THE COMMAND TO RUN", commandToRun);

	execSync(`${commandToRun}`, { cwd: process.cwd(), stdio: "inherit" });
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
	console.log("THE COMMANDS", commands);

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
	console.log("THE COMMAND", command);
	console.log("Command KEYS", commandOptionsKeys);

	// Loop through each option
	commandOptionsKeys.forEach((option) => {
		console.log("The option", option);
		console.log("The command ", command.options);
		console.log("THE COMMNAD.OPTIONS.option", command.options[option]);
		let commandOption = command.options[option];
		console.log("THE CONFIG ACTIONS", configActionOptions);
		if (!configActionOptions[option]) {
			console.log("THE OPTION IS NOT IN ACTION", option);
			if (command?.shouldDefault) {
				if (commandOption?.alias) {
					terminalOptionsFromConfig += `${commandOption.alias} ${commandOption.value} `;
				} else {
					terminalOptionsFromConfig += `${commandOption.value} `;
				}
			}
		} else {
			console.log("THE CONFIG ACTIONS", configActionOptions);
			if (commandOption?.alias) {
				if (commandOption?.value) {
					terminalOptionsFromConfig += `${commandOption.alias} ${configActionOptions[option]} `;
				} else {
					terminalOptionsFromConfig += `${commandOption.alias} `;
				}
			} else {
				terminalOptionsFromConfig += `${configActionOptions[option]} `;
			}
		}
	});
	console.log("TERMINAL OPTIONS FROM CONFIG", terminalOptionsFromConfig);

	return `${commands[config.action].commandName} ${terminalOptionsFromConfig}`;
};
