export const init = function () {
	this.adLog("Router has been initialised");
	this.listens({
		"config-router": this.handleConfigRouter.bind(this),
		"router-middleware": this.handleRouterMiddleware.bind(this),
		"attach-routes": this.handleAttachRoutes.bind(this),
	});
};
export const handleConfigRouter = function (data) {
	const self = this;
	self.pao.pa_wiLog("THE HANDLE CONFIG ROUTER MODULE");
	self.pao.pa_wiLog(data);
	self.routes = data;
};
export const handleRouterMiddleware = function (data) {
	const self = this;
	self.pao.pa_wiLog("THE ROUTER MIDDLEWARE");
	self.pao.pa_wiLog(data);
	self.routerMiddleware = data.middleware;
};
export const handleAttachRoutes = function (data) {
	this.attachRoutes(data);
};
export const attachRoutes = function (data) {
	const self = this;
	console.log("ATTACHING ROUTES", data);
	if (data.app) {
		let aliasList = [];
		let aliatikHandlers = [];
		data.app.use(self.cors());
		data.app.use("/", data.router);

		if (!self.routes) {
			self.warn("NO_CONFIGURED_ROUTES, ANZII WILL RESOLVE TO DEFAULT ROUTES");
			// self.warn('Anzii is rendering default routes::')
			const defaultRoutes = [
				{
					path: "/greeting/:name/:surname",
					alias: "hello",
					method: "GET",
					type: "public",
				},
				// {
				// path: '/test',
				// method: 'POST',
				// 	type: 'public'
				// },
				// {
				// 	path: '/test',
				// 	method: 'GET',
				// 	type: 'public'
				// },
				// {
				// 	path: '/',
				// 	method: 'GET',
				// 	type: 'public'
				// }
			];
			defaultRoutes.forEach((r) => {
				if (r.alias)
					aliasList.push(r.path.split("/")[1]), aliatikHandlers.push(r.alias);
				r["router"] = data.router;
				self.renderRoute(r);
			});
			data.router.use(self.outOfRouterContext.bind(this));
			aliasList.length > 0
				? self.emit({
						type: "router-alias-list",
						data: { aliasList: aliasList, handlers: aliatikHandlers },
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  })
				: "";
			return;
		}
		self.routes.forEach((r) => {
			if (r.alias)
				aliasList.push(r.path.split("/")[1]), aliatikHandlers.push(r.alias);
			r["router"] = data.router;
			self.renderRoute(r);
		});
		// data.router.use("*.js", (req, res, next) => {
		// 	res.set("Content-Type", "text/javascript");
		// 	console.log("SETTING JS");
		// 	return res.status(200);
		// });
		// data.router.use(
		// 	/\.(gif|jpe?g|tiff?|png|webp|bmp|ico)$/i,
		// 	(req, res, next) => {
		// 		var extname = path.extname(req.url);
		// 		let ext = "";

		// 		switch (extname) {
		// 			case ".png":
		// 				ext = "image/png";
		// 				break;
		// 			case ".svg":
		// 				ext = "image/svg+xml";
		// 				break;
		// 			case ".gif":
		// 				ext = "image/gif";
		// 				break;
		// 			case ".jpeg":
		// 				ext = "image/jpeg";
		// 				break;
		// 			case ".jpg":
		// 				ext = "image/jpg";
		// 				break;
		// 			default:
		// 				console.log("UNKNOWN EXTENSION");
		// 		}
		// 		console.log("SETTING IMAGES");
		// 		res.set("Content-Type", `${ext}`);

		// 		return res.status(200);
		// 	},
		// );
		// data.router.use("*.css", (req, res, next) => {
		// 	console.log("SETTING CSS");
		// 	res.set("Content-Type", "text/css");
		// 	return res.status(200);
		// });

		data.router.use(self.outOfRouterContext.bind(this));
		// data.app.get("/*", self.outOfRouterContext.bind(this));
		aliasList.length > 0
			? self.emit({
					type: "router-alias-list",
					data: { aliasList: aliasList, handlers: aliatikHandlers },
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  })
			: "";
	}
};
export const renderRoute = function (r) {
	const self = this;
	const pao = this.pao;
	console.log("ATTACHING ROUTES: RENDER ROUTE", self.routerMiddleware, r.type);
	let routy = {
		router: r.router,
		method: r.method,
		path: r.path,
		handOver: self.handOver,
	};
	// self.pao.pa_wiLog('THE ROUTE MIDDLEWARE')
	// self.pao.pa_wiLog(self.routerMiddleware.public)
	if (r.middlewares) {
		if (self.routerMiddleware && self.routerMiddleware[r.type]) {
			self.middlewareType(r.type, r.middlewares);
			self.middlewareType(
				r.type,
				pao.pa_objectToArray(self.routerMiddleware[r.type]),
			);
			self.appendRouter({
				middleware: self[`filtered${r.type}Middlewares`],
				...routy,
			});
			self[`filtered${r.type}Middlewares`] = [];
		} else {
			self.middlewareType(r.type, r.middlewares);
			self.appendRouter({
				middleware: self[`filtered${r.type}Middlewares`],
				...routy,
			});
			self[`filtered${r.type}Middlewares`] = [];
		}
	} else if (self.routerMiddleware && self.routerMiddleware[r.type]) {
		self.middlewareType(
			r.type,
			pao.pa_objectToArray(self.routerMiddleware[r.type]),
		);
		self.appendRouter({
			middleware: self[`filtered${r.type}Middlewares`],
			...routy,
		});
		self[`filtered${r.type}Middlewares`] = [];
	} else {
		self.appendRouter(routy);
		self[`filteredpublicMiddlewares`] = [];
		self[`filteredprivateMiddlewares`] = [];
	}
};
export const appendRouter = function (r) {
	// self.pao.pa_wiLog('THE APPENDROUTER')
	// self.infoSync('THE CURRENT ROUTER')
	// self.infoSync(r)
	if (r.middleware) {
		// self.info('THE CURRENT ROUTER with middleware')
		// self.infoSync(r.path)
		// self.infoSync(r.middleware)
		// self.infoSync(r.handOver)
		console.log("THE ROUTER BEING CONFIGURED", r);
		r.router[r.method.toLowerCase()](
			r.path,
			r.middleware,
			r.handOver.bind(this),
		);
	} else {
		// self.info('THE CURRENT ROUTER with middleware')
		// self.infoSync(r.path)
		// self.infoSync(r.middleware)
		// self.infoSync(r.handOver)
		r.router[r.method.toLowerCase()](r.path, r.handOver.bind(this));
	}
};
export const middlewareType = function (type, middlewares) {
	const self = this;
	// self.pao.pa_wiLog('THE MIDDLEWARETYP MIDDLEWARES')
	// self.pao.pa_wiLog(middlewares)
	// self.infoSync('The Router middlewares')
	// self.infoSync(middlewares)
	middlewares.forEach((m) => {
		if (m.type === "function") {
			self[`filtered${type}Middlewares`].push(m.value);
		} else if (m.type === "module") {
			self.emit({
				type: `add-${m.value}-middleware`,
				data: { type: type, filterCallback: self.filterCallback.bind(self) },
			});
		}
	});
};
export const outOfRouterContext = async function (req, res) {
	const self = this;
	let data = null;
	let reqresID = self.pao.pa_generateUniqueID();
	req.R_ID = reqresID;
	res.R_ID = reqresID;
	self.infoSync("Handling out of context route");
	self.infoSync(req.originalUrl);
	self.adLog("THE OUTOFROUTERCONTEXT REQUESTS");
	// let folderPatH = `${self.pao.pa_getWorkingFolder()}${self.path.sep}build${
	// 	self.path.sep
	// }index.html`;

	// data = {
	// 	error: false,
	// 	accepts: "html",
	// 	type: "StaticServe",
	// 	code: 200,
	// 	sendFile: true,
	// 	fileSource: folderPatH,
	// };
	// if (self) {
	// 	return res.sendFile(folderPatH);
	// 	// return self.emit({
	// 	// 	type: "write-server-request-response",
	// 	// 	data: { data: data, res: res },
	// 	// });
	// }

	// self.logSync(req.is)
	// self.logSync(req.get)
	// self.logSync(req.is('text'))
	self.adLog(req.accepts(["html", "json"]));
	console.log("THE ACCEPTED WITH TYPE", req.get("Content-Type"));
	// self.logSync(req.accepts())
	if (req.accepts(["html", "json"]) === "json") {
		data = {
			error: false,
			accepts: "html",
			type: "StaticServe",
			code: 200,
			sendFile: true,
			fileSource: folderPath,
		};
	} else if (req.accepts(["html", "json"]) === "html") {
		// console.log("REQUEST ACCEPTS IN HTML", req.accepts(["html", "json"]));
		// let folderPath = `${self.pao.pa_getWorkingFolder()}${self.path.sep}views${
		// 	self.path.sep
		// }index.html`;
		// self.pao.pa_wiLog(`folder path: ${folderPath}`);
		// self.pao.pa_wiLog(`working folder: ${self.pao.pa_getWorkingFolder()}`);
		// self.pao.pa_wiLog(
		// 	`IS EXISTING FOLDER VIEWS: ${self.pao.pa_isExistingDir(
		// 		folderPath.trim(),
		// 	)}`,
		// );
		// if (self.pao.pa_isExistingDir(folderPath.trim())) {
		// 	data = {
		// 		error: false,
		// 		accepts: "html",
		// 		type: "StaticServe",
		// 		code: 200,
		// 		sendFile: true,
		// 		fileSource: folderPath,
		// 	};
		// } else {
		// 	data = {
		// 		error: true,
		// 		accepts: "html",
		// 		type: "NotFound",
		// 		code: 404,
		// 		message: "Resource was not found: OutOfContext",
		// 	};
		// }

		data = {
			error: true,
			accepts: "html",
			type: "NotFound",
			code: 404,
			message: "Resource was not found: OutOfContext",
		};
	} else {
		data = {
			error: true,
			accepts: "txt",
			type: "NotFound",
			code: 404,
			message: "Resource was not found: OutOfContext",
		};
	}
	return self.emit({
		type: "write-server-request-response",
		data: { data: data, res: res },
	});
};
export async function handOver(req, res, next) {
	const self = this;
	console.log("HANDOVER IS IN ACTION");
	await self.pao.pa_wiLog("THE CAUGHT REQUEST INSIDE ROUTER::END POINT HIT");
	self.infoSync(next);
	let reqresID = self.pao.pa_generateUniqueID();
	req.R_ID = reqresID;
	res.R_ID = reqresID;
	self.infoSync(
		`HANDLING REQUEST OF ID: ${req.R_ID.split("-")[0]} WITH METHOD: ${
			req.method
		} AND URL OF: ${req.originalUrl}`,
	);
	await self.pao.pa_wiLog(req.originalUrl);
	await self.pao.pa_wiLog(req.params);
	await self.pao.pa_wiLog(req.body);
	return self.emit({
		type: "request-handover",
		data: { req: req, res: res, next: next },
	});
	// return res.json({todo:{list:{items:['I ate food','I wrote code','I read a book','I watched a movie']}}})
}
export const filterCallback = function (filterType, moduleMiddleware) {
	const self = this;
	if (filterType === "public") {
		self.filteredpublicMiddlewares.push(moduleMiddleware);
	} else {
		self.filteredprivateMiddlewares.push(moduleMiddleware);
	}
};
