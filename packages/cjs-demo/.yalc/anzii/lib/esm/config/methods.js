/* eslint-disable no-mixed-spaces-and-tabs */
import path from "path";
export const init = function () {
	this.adLog("Config has been initialised");
	this.setLogNamespaces();
	this.getConfigFile().then((resolvedValue) => {
		this.adLog(`THE resolved ${resolvedValue}`);
		this.doBefore();
	});
	this.listens({
		"config-manual": this.handleManualConfig.bind(this),
	});
};
export const setLogNamespaces = function () {
	let defaultDebugNamespaces =
		"anzii:system,anzii:server, anzii:request,anzii:router,anzii:server ";
	if (!process.env.Debug) return (process.env.Debug = defaultDebugNamespaces);
};
export const getConfigFile = function () {
	const self = this;
	const pao = self.pao;
	const loadFile = pao.pa_loadFile;

	return new Promise((resolve) => {
		loadFile(path.resolve("./", ".config.js"))
			.then((foundFile) => {
				// self.pao.pa_wiLog(
				// 	`Console.log fOUNDfiLE, ${JSON.stringify(foundFile)}`,
				// );
				self.config = foundFile;
				resolve(true);
			})
			.catch((err) => {
				// self.pao.pa_wiLog(`The Call Is NOT FOUND", ${JSON.stringify(err)}`);
				self.config = null;
				resolve(true);
			});
	});

	// try {
	// 	console.log("FileToLoad",await loadFile(path.resolve('./',".config.js")))
	//     self.config = await loadFile(path.resolve('./',".config.js")).default
	// 	console.log("readFile",self.config)
	//     // console.log(self.config)
	// }
	// catch (error) {
	//      console.log('THE .CONFIG ERROR')
	//     console.log(error)
	//     self.warn('THE .config.js CONFIGURATION_FILE_WAS_NOT_FOUND_IN_THE_ROOT');
	//     self.warn('Anzii will use defaults');
	//     self.config = null;
	// }
};
export const configure = function () {
	const self = this;
	const pao = self.pao;
	// console.log(".ENV",process.env)
	// let config = self.config
	const isAppCli = pao.PROMPT.indexOf("cli") >= 0 ? true : false;
	const anziiCliWithServer = process.env?.ANZII_CLI_WITH_SERVER || null;
	const isAnziiCliWithServer =
		anziiCliWithServer && anziiCliWithServer === "true" ? true : false;
	const initializeCliWithServer = isAppCli && isAnziiCliWithServer;
	const anziiKickoffManually = process.env?.ANZII_KICK_OFF_MANUALLY;
	const isAnziiInitiateManually =
		(anziiKickoffManually && anziiKickoffManually === "true") || null;

	self.pao.pa_wiLog(`THE CONFIG IS APP CLI: ${isAppCli}`);
	self.pao.pa_wiLog(`THE CONFIG initi ${initializeCliWithServer}`);

	if (initializeCliWithServer || (isAnziiInitiateManually && !self.config)) {
		self.configLogger();
		return self.configReady();
	}

	self.configLogger();
	self.runAppConfig();
};
export const enviroment = function () {
	const self = this;
	let envObserver = self.envObserver;
	// let supportsColor = self.supportsColor
	// self.pao.pa_wiLog('THE CURRENT ENVIROMENT')
	// self.pao.pa_wiLog(envObserver)
	// if (supportsColor.stdout) {
	// 	self.pao.pa_wiLog('Terminal stdout supports color');
	// }
	// if (supportsColor.stdout.has256) {
	// 	self.pao.pa_wiLog('Terminal stdout supports 256 colors');
	// }
	// if (supportsColor.stderr.has16m) {
	// 	self.pao.pa_wiLog('Terminal stderr supports 16 million colors (truecolor)')
	// }
	if (self.envObserver.has("enviroment")) {
		if (self.aliases[envObserver?.enviroment]) {
			self.env = self.aliases[envObserver.enviroment];
			let envCofig = envObserver.get(self.env);
			if (envCofig?.database) {
				let clients = [];
				let db = envCofig.database;
				// self.pao.pa_wiLog('THE DB')
				// self.pao.pa_wiLog(db)
				for (let c in db) {
					// self.pao.pa_wiLog('THE VALUE Of C')
					// self.pao.pa_wiLog(c)
					// self.pao.pa_wiLog(db[c])
					clients.push({
						name: c,
						connect: db[c].connect,
					});
				}
				// self.pao.pa_wiLog('THE DATABASE CLIENTS')
				// self.pao.pa_wiLog(clients)
				self.emit({
					type: `config-dman`,
					data: { clients: clients },
				});
				self.emit({
					type: `config-backupr`,
					data: { clients: clients },
				});
			}
			if (envObserver.has("appOrphic")) {
				// self.pao.pa_wiLog('THE JWT appOrphic')
				// self.pao.pa_wiLog(envObserver)
				// self.pao.pa_wiLog(envObserver.appOrphic)
				// self.pao.pa_wiLog(envObserver.appOrphic.flaDev)
				self.emit({
					type: "save-jwt-key",
					data: { key: envObserver.appOrphic["flaDev"] },
				});
			} else {
				self.emit({
					type: "save-jwt-key",
					data: { key: "f124sfet48tq3dfmlvoszx1" },
				});
			}
		} else {
			self.log("Enviroment config invalid, resorting to default", "warn");
		}
	}
	// let db = self.envObserver.get('dev')
	// self.pao.pa_wiLog(db)
	// self.pao.pa_wiLog(db.database.mysql.connect.user)
};
export const handleManualConfig = function (data = null) {
	const self = this;
	self.pao.pa_wiLog(
		`MANUAL SERVER TRIGGER ACTIVATED,
		${data?.payload?.configs}`,
	);
	if (data?.payload?.customKickOff) {
		self.config = data?.payload?.config;
		return self.runAppConfig();
	}
	self.runAppConfig(data);
};
export const runAppConfig = function (manualConfig = null) {
	const self = this;
	let config = null;
	let isServerConfig = false;
	if (!manualConfig) {
		config = self.config;
	} else {
		config = manualConfig?.payload?.configs
			? self.mergeConfigs(manualConfig?.payload?.configs)
			: self.config;
		let { payload } = manualConfig;
		let { compiler, wepackMiddlewares, webpackConfig } = payload;
		const { webpackDevMiddleware, webpackHotMiddleware } = wepackMiddlewares;

		// self.pao.pa_wiLog("THE CONFIG");
		// self.pao.pa_wiLog(JSON.stringify(config));
		// self.pao.pa_wiLog(`runAPPcoNFIG", ${JSON.stringify(manualConfig)}`);
		// self.pao.pa_wiLog(`THE APP CONFIG", ${JSON.stringify(self.config)}`);
		// self.pao.pa_wiLog(`THE COMPILEr", ${manualConfig?.payload?.webpackConfig}`);

		/* The code immediately after this comment should be re-organized 
      it's just using a quick dirty approach to test some logic
    */

		self.config["middleware"] = {
			ppublic: {
				addMiddleware: [
					{
						type: "function",
						value: webpackDevMiddleware(compiler, {
							publicPath: webpackConfig.output.path,
							writeToDisk: true,
							serverSideRender: true,
						}),
					},
					// {
					//     type:"function",
					//     value: webpackHotMiddleware(compiler,{
					//         log: true,
					//         path: "/__kotii",
					//         heartbeat: 2000
					//     })

					// }
				],
			},
			all: {
				addMiddleware: [
					{
						type: "function",
						value: webpackHotMiddleware(compiler, {
							log: console.log,
							path: "/__kotii",
							heartbeat: 2000,
						}),
						extra: "hotModule",
					},
				],
			},
		};
	}

	/**
	 *
	 *
	 */
	if (!self.config) {
		self.emit({ type: "config-system", data: { workers: 1, spawn: true } });
		// if (manualConfig)
		//     self.emit({ type: 'config-domain-resources', data: manualConfig });// To be re-organized
		if (manualConfig)
			self.emit({ type: "config-domain-resources", data: null });

		self.emit({
			type: `config-server`,
			data: `server`,
		});
		return;
	}
	if (self.config) {
		let serverConfig = null;
		self.enviroment();
		self.config?.cluster
			? self.emit({ type: "config-system", data: self.config.cluster })
			: self.emit({ type: "config-system", data: { workers: 1, spawn: true } });

		for (let c in config) {
			self.pao.pa_wiLog(`THE C IN CONFIG", ${c}`);
			self.pao.pa_wiLog("The module in Config");
			self.pao.pa_wiLog(c);
			/*
			 This section of the code should be refactoured such so that server event should be the last to be
			 sent out. This starts kicks off the server operations such as listening to server requests
			*/
			if (c === "server") {
				serverConfig = config[c];
				isServerConfig = true;
			}
			if (c === "router") {
				if (config.views) {
					self.emit({ type: "config-request", data: config[c] });
					self.emit({
						type: "config-view",
						data: { routes: config[c], handlers: config.views },
					});
					self.emit({
						type: "take-ssr-routes",
						data: { payload: { routes: config[c] } },
					});
				} else {
					self.emit({ type: "config-request", data: config[c] });
					self.emit({
						type: "config-view",
						data: { routes: config[c], handlers: config.views },
					});
					self.emit({
						type: "take-ssr-routes",
						data: { payload: { routes: config[c] } },
					});
				}
			}
			/**
			 *
			 * This section of the code along with the server section above should be refactored
			 */
			if (c !== "logger" && c !== "views" && c !== "server") {
				self.emit({
					type: `config-${c}`,
					data: config[c],
				});
			}
		}

		/**
		 *
		 * This section of the code along with the server section above should be refactored
		 */
		self.emit({ type: "config-domain-resources", data: null }); // to be re-organized
		self.pao.pa_wiLog(`isServer Value", ${isServerConfig}`);
		if (isServerConfig) {
			self.emit({
				type: `config-server`,
				data: serverConfig,
			}); // TO be re-organized
		}
	}
};
export const configLogger = function () {
	const self = this;
	if (self.config?.logger) {
		// self.pao.pa_wiLog('THE LOGGER IS THE FIRST MODULE TO GET CONFIG')
		self.emit({
			type: `config-anziiloger`,
			data: self.config.logger,
		});
	} else {
		self.emit({
			type: `config-anziiloger`,
			data: { level: "info" },
		});
	}
};
export const doBefore = function () {
	const self = this;
	const pao = self.pao;
	const loadFile = pao.pa_loadFile;

	loadFile(path.resolve("./", "package.json"))
		.then((foundFile) => {
			self.configure();
		})
		.catch((err) => {
			self.configure();
		});
};
export const configReady = function () {
	const self = this;
	const pao = self.pao;

	self.emit({
		type: `config-is-ready`,
		data: {},
	});
};
export const mergeConfigs = function (configToMerge) {
	const self = this;
	let config = self.config ? self.config : null;

	if (!config) return (self.config = configToMerge);
	for (let confiItem in configToMerge) {
		if (self.config[confiItem]) {
			if (self.config[confiItem] instanceof Array) {
				self.config[confiItem] = [
					...self.config[confiItem],
					...configToMerge[confiItem],
				];
			} else {
				self.config[confiItem] = {
					...self.config[confiItem],
					...configToMerge[confiItem],
				};
			}
		}
	}
};
