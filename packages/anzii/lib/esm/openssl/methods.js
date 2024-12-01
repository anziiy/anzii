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
	loadFile(path.resolve(thisFileDir, "generateConfig.json")).then(
		(sslConfig) => {
			console.log("SSL CONFIG", sslConfig);
			console.log("ACTION", JSON.parse(sslConfig).action);
			let config = JSON.parse(sslConfig);
			let options = self.runOptions(config);
			self.runTerminal(`openssl ${options}`);
			// console.log("RUN TERMINAL OPTIONS", options);

			// self.runTerminal("openssl");
			// let appConfig = {
			// 	...config,
			// 	...apiConfig,
			// 	router: [...apiConfig.router, ...config.router],
			// };
			// resolve(appConfig);
		},
	);
};

/**
 *
 * @param {*} commandr
 * runTerminal
 */
export const runTerminal = function (
	commandr,

	// scriptPath,
	// fileToRun,
	// fromContext,
	// options,
	// scriptsPath,
) {
	// let optionsValue = options[0][0] ? options[0] : "";
	// console.log("options value", optionsValue);
	// console.log("THE SCRIPTS PATH", scriptsPath);

	// let commandToRun = `${commandr} ${path.join(
	// 	scriptPath,
	// 	fileToRun,
	// )} ${optionsValue
	// 	.toString()
	// 	.replace(/,/g, " ")} --local-scripts ${scriptsPath}`;
	let commandToRun = `${commandr}`;
	// console.log("THE PROCESS CWD", process.cwd());

	// console.log("COMMAND TO RUN", commandToRun);
	execSync(`${commandToRun}`, { cwd: process.cwd(), stdio: "inherit" });
};

export const runOptions = function (config) {
	const self = this;
	console.log(
		"THE CONFIG",
		config,
		config?.action,
		!config.action || !config.actions,
	);
	if (!config?.action && !config?.actions) {
		throw new Error(
			"Openssl config requires config.action or config.actions to be defined",
		);
	}
	if (config?.action) {
		if (!commands[config.action]) {
			throw new Error("Openssl config contains that is not yet supported");
		}
		let command = commands[config.action];
		let configActionOptions = config.options;
		let terminalOptionsFromConfig = "";
		let commandOptionsKeys = Object.keys(command.options);
		console.log("THE COMMAND", command);
		console.log("Command KEYS", commandOptionsKeys);

		commandOptionsKeys.forEach((option) => {
			console.log("The option", option);
			console.log("The command ", command.options);
			console.log("THE COMMNAD.OPTIONS.option", command.options[option]);
			let commandOption = command.options[option];
			console.log("THE CONFIG ACTIONS", configActionOptions);
			if (!configActionOptions[option]) {
				if (commandOption?.alias) {
					terminalOptionsFromConfig += `${commandOption.alias} ${commandOption.value} `;
				} else {
					terminalOptionsFromConfig += `${commandOption.value} `;
				}
			} else {
				console.log("THE CONFIG ACTIONS", configActionOptions);
				if (commandOption?.alias) {
					terminalOptionsFromConfig += `${commandOption.alias} ${configActionOptions[option]} `;
				} else {
					terminalOptionsFromConfig += `${configActionOptions[option]} `;
				}
			}
		});
		console.log("TERMINAL OPTIONS FROM CONFIG", terminalOptionsFromConfig);

		return `${
			commands[config.action].commandName
		} ${terminalOptionsFromConfig}`;
	}
};
