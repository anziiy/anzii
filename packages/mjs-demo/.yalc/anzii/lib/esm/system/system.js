import cluster from "cluster";
import detectPort from "detect-port";
import open from "open";
import os from "os";
import path from "path";
import portFinder from "portfinder";
import * as methods from "./methods.js";
class System {
	constructor(pao) {
		this.pao = pao;
		this.context = process;
		this.env = this.context.env;
		this.cluster = cluster;
		this.os = os;
		this.path = path;
		this.shutDownServices = [];
		this.numOfDBSD = 3;
		this.allowedDBSTR = 10000;
		this.serverTimeout = 1000 * 60 * 3;
		this.systemIsShuttingDown = false;
		this.shutDownOrder = [];
		this.systemBase = { DOCUMENT_ROOT: process.cwd() };
		this.open = open;
		this.detectPort = detectPort;
		this.portFinder = portFinder;
		this.init = methods.init;
		this.handleConfigureSystem = methods.handleConfigureSystem;
		this.handleRegisterShutDownCandidate =
			methods.handleRegisterShutDownCandidate;
		this.handleServerAttachWorkers = methods.handleServerAttachWorkers;
		this.handleDistributeSystemResources =
			methods.handleDistributeSystemResources;
		this.masterWorker = methods.masterWorker;
		// this.folkSlaveWorkers = methods.folkSlaveWorkers
		this.handleShutDowns = methods.handleShutDowns;
		this.shutDown = methods.shutDown;
		this.openBrowserApp = methods.openBrowserApp;
		this.getServerPort = methods.getServerPort;
	}
}
export default System;
