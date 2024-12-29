/* eslint-disable no-unused-vars */
export const init = function () {
	this.setDebugger(this.constructor.name);
	this.listens({
		"config-anziiloger": this.handleAnziilogerConfig.bind(this),
		"anziiloger-log": this.handleLogRequest.bind(this),
	});
};
export const handleLogRequest = function (data) {
	const self = this;
	const pao = self.pao;
	const cliLogsSet = process.env.ANZII_SHOW_CLI_LOGS || "false";
	const shouldShowCliLogs = cliLogsSet === "true" ? true : false;
	if (pao.PROMPT.indexOf("cli") >= 0 && shouldShowCliLogs === false) return;
	if (self.logger) {
		switch (data.type) {
			case "info":
				self.info(data);
				break;
			case "warn":
				self.warn(data);
				break;
			case "error":
				self.error(data);
				break;
			case "adLog":
				self.aLog(data);
				break;
			case "wiLog":
				self.iLog(data);
				break;
			default:
				self.debug(data);
		}
	} else {
		console.log(
			data.source,
			"logged message: ",
			data.message,
			" of type ",
			data.type,
		);
	}
};
export const handleAnziilogerConfig = function (data) {
	const self = this;
	const pao = self.pao;
	let now = new Date();
	self.logger = new self.winlo.createLogger({
		transports: [
			// new  self.winlo.transports.File(
			// 	{
			// 	name: 'production',
			// 	level: 'info',
			// 	filename: './logs/production.log',
			// 	handleExceptions: true,
			// 	json: true,
			// 	label: 'Anzilloger',
			// 	maxsize: 5242880,
			// 	maxFiles: 5,
			// 	timestamp: now,
			// 	colorize: false}
			// ),
			// new  self.winlo.transports.File(
			// 	{
			// 	name: 'errors',
			// 	level: 'error',
			// 	filename: './logs/errors.log',
			// 	handleExceptions: true,
			// 	json: true,
			// 	label: 'Anzilloger',
			// 	maxsize: 5242880,
			// 	maxFiles: 5,
			// 	timestamp: true,
			// 	colorize: false}
			// ),
			new self.winlo.transports.Console({
				level: "debug",
				label: "Anzilloger",
				timestamp: true,
				colorize: true,
			}),
			new self.winlo.transports.Console({
				level: "info",
				label: "Anzilloger",
				timestamp: true,
				colorize: true,
			}),
			new self.winlo.transports.Console({
				level: "warn",
				label: "Anzilloger",
				timestamp: true,
				colorize: true,
			}),
			new self.winlo.transports.Console({
				level: "error",
				label: "Anzilloger",
				timestamp: true,
				colorize: true,
			}),
		],
	});
};
export const info = async function (log) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;

	contains(log, "sync")
		? self.runForDebuggerOrNone(log, "info")
		: self.runForDebuggerOrNone(log, "info", false);
};
export const debug = async function (log) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	contains(log, "sync")
		? self.runForDebuggerOrNone(log, "debug")
		: self.runForDebuggerOrNone(log, "debug", false);
};
export const warn = async function (log) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;

	contains(log, "sync")
		? self.runForDebuggerOrNone(log, "warn")
		: self.runForDebuggerOrNone(log, "warn", false);
};
export const error = async function (log) {
	//const self = this
	//self.logger.error(`${log.source}: ${log.message}`)
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	if (contains(log, "sync")) {
		await self.logger.error(`${log.source}: ${log.message}`);
	} else {
		self.logger.error(`${log.source}: ${log.message}`);
	}
};
export const aLog = async function (log) {
	const self = this;
	//self.logger.error(`${log.source}: ${log.message}`)
	// self.pao.pa_wiLog(process.env)
	// if(process.env.ANZII_SHOW_DEBUG_LOGS && process.env.ANZII_SHOW_DEBUG_LOGS.trim().toLowerCase() === 'true') console.log(log.message)
	if (!process.env.ANZII_SHOW_DEBUG_LOGS) return;
	if (process.env.ANZII_SHOW_DEBUG_LOGS.trim().toLowerCase() !== "true") return;
	self.pao.pa_wiLog("aLog:ANZIILOGER");
	self.pao.pa_wiLog(process.env.ANZII_SHOW_DEBUG_LOGS);
	console.log(log.message);
	// const self = this
	// const pao = self.pao
	// const contains = pao.pa_contains
};
export const iLog = async function (log) {
	const self = this;
	//self.logger.error(`${log.source}: ${log.message}`)
	// self.pao.pa_wiLog(process.env)
	// if(process.env.ANZII_SHOW_DEBUG_LOGS && process.env.ANZII_SHOW_DEBUG_LOGS.trim().toLowerCase() === 'true') console.log(log.message)
	if (!process.env.ANZII_SHOW_WILD_LOGS) return;
	if (process.env.ANZII_SHOW_WILD_LOGS.trim().toLowerCase() !== "true") return;
	self.pao.pa_wiLog("iLog:ANZIILOGER");
	self.pao.pa_wiLog(process.env.ANZII_SHOW_WILD_LOGS);
	console.log(log.message);
	// const self = this
	// const pao = self.pao
	// const contains = pao.pa_contains
};
export const setDebugger = async function (mod) {
	const self = this;
	let name = mod.toLowerCase();
	self.debugas[name] = self.debugr(`anzii:${name}`);
	self.debugas[name].enabled = true;
	self.debugas[name].useColors = true;
};

export const useColorsAndEnableDebugger = function (log) {
	const self = this;
	!self.debugas[log.source.toLowerCase()].useColors
		? (self.debugas[log.source.toLowerCase()].useColors = true)
		: "";
	!self.debugas[log.source.toLowerCase()].enabled &&
	process?.env?.NODE_ENV?.toLowerCase() === "production"
		? (self.debugas[log.source.toLowerCase()].enabled = true)
		: "";
};
export const runForDebuggerOrNone = async function (
	log,
	loggerType,
	isAsync = true,
) {
	const self = this;

	if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
		// self.useColorsAndEnableDebugger(log);
		isAsync
			? await self.debugas[log.source.toLowerCase()](...log.message)
			: self.debugas[log.source.toLowerCase()](...log.message);
	} else {
		try {
			isAsync
				? await self.logger[loggerType](`${log.source}:`, ...log.message)
				: self.logger[loggerType](`${log.source}:`, ...log.message);
		} catch (e) {
			console.log(e);
		}
	}
};
