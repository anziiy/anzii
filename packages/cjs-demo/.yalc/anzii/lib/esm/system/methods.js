/* eslint-disable no-unused-vars */
export const init = function () {
	this.adLog("System has been initialised");
	this.listens({
		"config-system": this.handleConfigureSystem.bind(this),
		"register-shutdown-candidate":
			this.handleRegisterShutDownCandidate.bind(this),
		"distribute-system-resources":
			this.handleDistributeSystemResources.bind(this),
		"attach-workers-to-server": this.handleServerAttachWorkers.bind(this),
	});
	// self.pao.pa_wiLog(this.env)
};
export const handleConfigureSystem = function (data) {
	const self = this;
	self.pao.pa_wiLog(`System ENVIROMENT IS: ${self.env}`, process.env);
	self.pao.pa_wiLog(self.env);
	// self.pao.pa_wiLog(cwd)
	// self.pao.pa_wiLog(path.sep)
	// self.pao.pa_wiLog(path.sep+'includes')
	// self.pao.pa_wiLog(cwd.substr(0, cwd.indexOf(path.sep+'includes')) >= 0)
	self.pao.pa_wiLog(self.systemBase?.DOCUMENT_ROOT);
	self.handleShutDowns();
	self.clusterCustomConfig = data;
	self.adLog("The system is about to emit system resources to premier modules");
	self.emit({
		type: "take-premier-system-base",
		data: { systemBase: self.systemBase },
	});
	// self.masterWorker(data)
};
export const handleDistributeSystemResources = async function (data) {
	const self = this;
	const pao = self.pao;
	const getFiles = pao.pa_getFiles;
	const getDirs = pao.pa_getDirectories;
	const getFile = pao.pa_getFile;
	const makeDirs = pao.pa_makeDirs;
	const getExtension = pao.pa_getExtension;
	const path = self.path;
	let dirPath = `${self.systemBase.DOCUMENT_ROOT}`;
	let filePath = `${self.systemBase.DOCUMENT_ROOT}${path.sep}sev.js`;
	let createPath = `${self.systemBase.DOCUMENT_ROOT}${path.sep}`;
	// const path = self.path
	// const cwd = process.cwd()
	// self.pao.pa_wiLog(cwd)
	// self.pao.pa_wiLog(path.sep)
	// self.pao.pa_wiLog(path.sep+'includes')
	// self.pao.pa_wiLog(cwd.substr(0, cwd.indexOf(path.sep+'includes')) >= 0)
	// self.pao.pa_wiLog('HandleDistributeSystemResources ')
	// // let files = await getFiles(dirPath,{recursive: false},'sev.js')
	// let dirs = await getDirs(dirPath)
	// let file = await getFile(filePath)
	let status = await makeDirs(createPath);
	let ext = getExtension("sev.js");
	// self.pao.pa_wiLog('GET FILES CALLBACK GETS A CALL')
	// self.pao.pa_wiLog(files)
	// self.pao.pa_wiLog(dirs)
	// self.pao.pa_wiLog(file)
	self.pao.pa_wiLog(ext);
	self.pao.pa_wiLog(status);
	self.emit({
		type: "take-system-base",
		data: { systemBase: self.systemBase },
	});
	// self.masterWorker(data)
};
export const shutDown = function (type, code) {
	const self = this;
	console.log(`SHUTDOWN TYPE: ${type},code: ${code}`);
	console.log(code);
	self.systemIsShuttingDown = true;
	if (self.shutDownServices.length > 0) {
		self.shutDownServices.forEach((sd, i) => {
			if (typeof sd !== "function") {
				console.log(
					`Service: ${self.shutDownOrder[i]} must be a function,shutdown attempt failed`,
					"warn",
				);
			} else {
				console.log(
					`Service: ${self.shutDownOrder[i]} is shutting down`,
					"info",
				);
			}
		});
	}
	console.log(
		`System is shutting down through: ${type},with code: ${code.stack}`,
	);
	type === "uncaughtException" ? self.context.kill(1) : self.context[type]();
};
export const masterWorker = function (app) {
	const self = this;
	// console.log("ENV PORT", self?.context?.env?.PORT);
	const serverTimeout = self.serverTimeout;
	const portToUse = self?.context?.env?.PORT ? self?.context?.env?.PORT : 3000;
	const shouldOpenBrowser = self?.context?.env?.ANZII_OPEN_BROWSER
		? true
		: false;
	const shouldStopServer = self?.context?.env?.ANZII_STOP_SERVER ? true : false;

	self
		.getServerPort(portToUse)
		.then((availablePort) => {
			self.pao.pa_wiLog(`THE AVAILABLE PORT, ${availablePort}`);
			self.pao.pa_wiLog(`THE STATUS OF isMaster: ${self.cluster.isMaster}`);
			self.pao.pa_wiLog(`THE cluster, ${self.cluster}`);
			self.pao.pa_wiLog(`THE CLUSTERS, ${self.clusterCustomConfig}`);
			if (self.cluster.isMaster) {
				self.pao.pa_wiLog(`Master ${self.context.pid} is running`);
				if (self.clusterCustomConfig && self.clusterCustomConfig.spawn) {
					let slaves = self.clusterCustomConfig.workers
						? self.clusterCustomConfig.workers
						: "auto";
					if (slaves === "auto") {
						slaves = self.os.cpus().length;
						for (let s = 0; slaves < slaves; s++) {
							self.cluster.fork();
						}
					} else {
						if (typeof slaves === "number") {
							for (let s = 0; s < slaves; s++) {
								self.pao.pa_wiLog(`Forking slave number: ${s}`);
								self.cluster.fork();
							}
						}
					}
					self.cluster.on("fork", (worker) => {
						self.pao.pa_wiLog("cluster forking new worker", worker.id);
					});
					let mainWorkerId = null;
					self.cluster.on("listening", (worker, address) => {
						self.pao.pa_wiLog("cluster listening new worker", worker.id);
						if (null === mainWorkerId) {
							self.pao.pa_wiLog(
								"Making worker " + worker.id + " to main worker",
							);
							mainWorkerId = worker.id;
							worker.send({ singleProcessTasks: "startSingleProcessTasks" });
						}
					});
					self.cluster.on("exit", (worker, code, signal) => {
						self.pao.pa_wiLog(`worker ${worker.process.pid} died`);
						self.pao.pa_wiLog("FORKING ANOTHER WORK");
						self.pao.pa_wiLog("Worker %d died :(", worker.id);
						if (!shouldStopServer) {
							if (worker.id === mainWorkerId) {
								self.pao.pa_wiLog("Main Worker is dead...");
								mainWorkerId = null;
							}
							self.pao.pa_wiLog("I am here");
							self.pao.pa_wiLog(worker);
							self.pao.pa_wiLog(code);
							self.pao.pa_wiLog(signal);
							self.cluster.fork();
							// self.cluster.fork()
						} else {
							console.log("Server has been shutdown");
						}
					});
				} else {
					self.adLog("System is running on a single thread/core");
					const serv = app.listen(availablePort, () => {
						self.infoSync(
							`The Server is listening via a worker on port:${availablePort}`,
						);
						self.adLog("THIS WORKER RUNNING IP:");

						if (shouldOpenBrowser) self.openBrowserApp(availablePort);

						//self.openBrowserApp();
					});

					serv.timeout = serverTimeout;
					setTimeout(function () {
						if (shouldStopServer) {
							console.log("Closing server");
							process.exit(0);
							//serv.close();
						}
					}, 3000);

					//   process.on('message', function(message) {
					// 	self.pao.pa_wiLog('Worker ' + process.pid + ' received message from master.', message);
					// 	if(message.singleProcessTasks == "startSingleProcessTasks") {
					// 		self.emit({type:'start-single-process-tasks',data:''})
					// 	}
					// });
				}
			} else {
				// self.pao.pa_wiLog('IT IS NOT THE MASTER PROCESS')
				self.pao.pa_wiLog(`Worker ${process.pid} started`);
				let serv = app.listen(availablePort, () => {
					let PORT = availablePort;
					self.infoSync(
						`The Application is running on PID:: ${process.pid} and listening on port: ${PORT}`,
					);
					// self.adLog("The Application is listening via workers");
					// self.pao.pa_wiLog("THIS WORKER RUNNING IP:");

					if (shouldOpenBrowser) self.openBrowserApp(availablePort);
				});
				process.on("message", function (message) {
					self.pao.pa_wiLog(
						"Worker " + process.pid + " received message from master.",
						message,
					);
					if (message.singleProcessTasks == "startSingleProcessTasks") {
						self.emit({ type: "start-single-process-tasks", data: "" });
					}
				});

				serv.timeout = serverTimeout;
				// self.infoSync("THE TIMEOUT VALUE");
				// self.infoSync(serv.timeout);
				setTimeout(function () {
					if (shouldStopServer) {
						console.log("CLOSING SERVER");
						process.exit(0);
						//serv.close();
					}
				}, 3000);
			}
		})
		.catch((err) => {
			console.log("Server could not be started due to a port isssue", err);
		});
};
// export const folkSlaveWorkers = function(mainWorker){
// }
export const handleShutDowns = function () {
	const self = this;
	self.pao.pa_wiLog("Shutdowns are being handled");
	self.context.on("INT", function (code) {
		if (!self.systemIsShuttingDown) {
			self.shutDown("kill", code);
		} else {
			self.infoSync("System is already ShuttingDown:: INT EXIT");
		}
	});
	self.context.on("SIGTEM", function (code) {
		if (!self.systemIsShuttingDown) {
			self.shutDown("exit", code);
		} else {
			self.infoSync("System is already ShuttingDown:: SIGTEM EXIT");
		}
	});
	self.context.on("uncaughtException", function (code) {
		if (!self.systemIsShuttingDown) {
			self.shutDown("uncaughtException", code);
		} else {
			self.infoSync("System is already ShuttingDown:: UNHANDLEDEXCEPTION EXIT");
		}
	});
	self.context.on("unhandledRejection", function (code) {
		self.infoSync(code.stack);
		if (!self.systemIsShuttingDown) {
			self.shutDown("uncaughtException", code);
		} else {
			self.infoSync("System is already ShuttingDown:: Unhandled Rejection");
		}
	});
};
export const handleServerAttachWorkers = function (data) {
	const self = this;
	self.masterWorker(data.app);
};
export const handleRegisterShutDownCandidate = function (data) {
	const self = this;
	const pao = self.pao;
	if (
		data.hasOwnProperty("candidate") &&
		pao.pa_isFunction(data.candidate) &&
		data.hasOwnProperty("name") &&
		pao.pa_isString(data.name)
	) {
		if (!(self.shutDownServices.indexOf(data.name) > -1)) {
			self.shutDownServices.push(data.candidate);
			self.shutDownOrder.push(data.name);
		}
	} else {
		self.pao.pa_wiLog("Candidate could not be registered for shutdown", "warn");
	}
};
export const openBrowserApp = async function (portToOpenTo) {
	const self = this;
	const open = self.open;
	await open(`http://localhost:${portToOpenTo}`);
	// console.log("THE BROWSER OPENED");
	// const openBrowser = () => import('open').then(({default: open}) => open("http://localhost:3000"));
	// openBrowser()
};

export const getServerPort = function (port = 3000) {
	const self = this;
	self.infoSync(`User preffered port: ${port}`);
	return new Promise((resolve, reject) => {
		self
			.detectPort(port)
			.then((gotPort) => {
				console.log("THE GOT PORT", gotPort);
				console.log("THE CHECKED PORT", port);
				console.log("THE TYPEOF PORT", typeof port);
				console.log("THE TYPEOF GOT PORT", typeof gotPort.toString());
				console.log("THE GOT PORT EQUALS PORT", gotPort === port);

				if (gotPort.toString() === port) {
					resolve(gotPort);
				} else {
					console.log("SEARCHING FOR OPEN PORT");
					self.portFinder
						.getPortPromise()
						.then((openPort) => {
							self.infoSync(
								`Specified port: ${port} is in use, anzii will resort to port:${openPort}`,
							);
							resolve(openPort);
						})
						.catch((err) => {
							reject(err);
						});
				}
			})
			.catch((err) => {
				console.log("Therw was an error trying to get a port", err);
				reject(err);
			});
	});
};
