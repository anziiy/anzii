import * as bodyParser from "body-parser";
import express from "express";
import jsonfile from "jsonfile";
import path from "path";
import * as methods from "./methods.js";
// const app = express()
// import notifier from './notifier'
class Server {
	constructor(pao) {
		this.pao = pao;
		this.xpress = express;
		this.http = this.xpress();
		this.router = this.xpress.Router();
		this.path = path;
		this.html = [];
		this.request = null;
		this.componentCount = 0;
		this.componentId = [];
		this.ssrComponentLen = 0;
		this.componentRefLen = 0;
		this.workers = [];
		this.fixedCompS = {
			before: [],
			after: [],
		};
		this.compData = [];
		this.dependiks = {
			jsonfile: jsonfile,
			bodyParser: bodyParser,
		};
		this.mimeTypes = {
			html: "text/html",
			txt: "text/plain",
			css: "text/css",
			gif: "image/gif",
			jpg: "image/jpeg",
			png: "image/png",
			svg: "image/svg+xml",
			js: "application/javascript",
		};
		// methods
		this.init = methods.init;
		this.handleConfigServer = methods.handleConfigServer;
		this.handleDomainResources = methods.handleDomainResources;
		this.handleWriteServerRequestResponse =
			methods.handleWriteServerRequestResponse;
		this.startServer = methods.startServer;
		this.streamResponse = methods.streamResponse;
		this.runServer = methods.runServer;
		this.streamResponse = methods.streamResponse;
		this.getHtml = methods.getHtml;
		this.getHtmlSkeleton = methods.getHtmlSkeleton;
	}
}
export default Server;
