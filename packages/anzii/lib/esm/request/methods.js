export const init = function () {
	this.adLog("Request has been initialised");
	this.listens({
		"config-request": this.handleConfigRequest.bind(this),
		"request-handover": this.handleRequestHandOver.bind(this),
		"request-global-request-response":
			this.handleRequestGlobalResponse.bind(this),
		// 'request-view-response': this.handleRequestViewResponse.bind(this),
		"request-global-request-error": this.handleRequestGlobalError.bind(this),
		"request-handler-error": this.handleHandlerError.bind(this),
		"router-alias-list": this.handleRouterAliasList.bind(this),
	});
};
export const handleConfigRequest = function (data) {
	const self = this;
	// self.infoSync("handleRequest Data;;;");
	// self.infoSync(data);
	data.forEach((route) => {
		route.view ? self.views.push(route.path) : "";
	});
};
export const handleRequestHandOver = function (data) {
	const self = this;
	self.infoSync("Handling Handed Request");
	self.infoSync(data.req.originalUrl);

	let aliasList = self.routesAliasList;
	let aliatikHandlers = self.aliatikHandlers;
	let parsed = self.parseRequest(data.req);
	self.debug("THE ALIATIKS");
	self.debug(parsed);
	self.debug(aliasList);
	self.debug(aliatikHandlers);
	data.req.uploads
		? parsed.user
			? (parsed.user.uploads = data.req.uploads)
			: (parsed.user = { uploads: data.req.uploads })
		: "";
	// self.debug('parsed')
	// self.debug(parsed.url.trim().split('/'))
	let handler = parsed.handler;
	aliasList.indexOf(handler) >= 0
		? (handler = aliatikHandlers[aliasList.indexOf(handler)])
		: "";
	self.handler = handler;
	if (handler && handler.trim() !== "") {
		self.debug("THERES A VALID HANDLE");
		self.debug(self.handler);
		let uza = parsed.user || null;
		self.requestData = {
			parsed: parsed,
			handler: handler,
			request: { req: data.req, res: data.res, next: data.next },
		};
		uza ? (self.requestData.user = uza) : "";
		self.debug(self.views);
		self.debug(!self.views || self.views.length === 0);
		self.debug(self.isView(data.req.originalUrl, uza));
		if (!self.views || self.views.length === 0)
			return self.emit({ type: "request-global-request", data: handler });
		if (self.isView(data.req.originalUrl, uza))
			return self.emit({
				type: `do-view-task`,
				data: {
					payload: self.requestData,
					callback: (fail = null, success = null, method = null) => {
						self.taskerHandler({ fail, res: data.res, success, method });
					},
				},
			});
		self.debug("none view should be rendered");
		return self.emit({ type: "request-global-request", data: handler });
	} else {
		// console.log("THERE IS NOT HANDLER", self.views);
		self.debug("THEre is no handler");
		self.debug(self.handler);
		if (!self.views || self.views.length === 0) return self.handlePathError();
		let uza = parsed.user || null;
		self.requestData = {
			parsed: parsed,
			handler: handler,
			request: { req: data.req, res: data.res, next: data.next },
		};
		uza ? (self.requestData.user = uza) : "";
		if (self.isView("/home"))
			return self.emit({
				type: `do-view-task`,
				data: {
					payload: self.requestData,
					callback: (fail = null, success = null, method = null) => {
						self.taskerHandler({ fail, res: data.res, success, method });
					},
				},
			});
		return self.handlePathError();
	}
};
export const parseRequest = function (req) {
	const self = this;
	self.debug("The req");
	self.debug(req.body);
	self.debug(req.query);
	self.debug(req.params);
	// self.debug('THE REQUEST BODY')
	// self.debug(req.body)
	let requiredData = { url: req.originalUrl };
	let url =
		requiredData.url.indexOf("/") === 0
			? requiredData.url.slice(1, requiredData.url.length)
			: requiredData.url;
	let isPath = url.indexOf("/") > 0 ? true : false;
	if (req.query && Object.keys(req.query).length > 0) {
		self.debug("THE QUERY");
		self.debug(req.query);
		requiredData.user = req.query;
		let urlFragments = url.split("?");
		if (isPath) {
			let pathFrags = urlFragments[0].split("/");
			self.debug("THE PATH FRAGS");
			self.debug(pathFrags);
			requiredData.handler = pathFrags[0];
		} else {
			self.debug("THE REMAINING CONTENT AFTER SPLIT OF ?");
			self.debug(urlFragments);
			requiredData.handler = urlFragments[0];
		}
	} else if (req.params && Object.keys(req.params).length > 0) {
		self.debug("THE PARAMS");
		self.debug(req.params);
		requiredData.user = req.params;
		if (isPath) {
			let pathFrags = url.split("/");
			self.debug("THE PATH FRAGS");
			self.debug(pathFrags);
			requiredData.handler = pathFrags[0];
		} else {
			requiredData.handler = url;
		}
	} else if (req.body && Object.keys(req.body).length > 0) {
		self.debug("THE REQUEST BODY");
		self.debug(req.body);
		requiredData.user = req.body;
		if (isPath) {
			let pathFrags = url.split("/");
			self.debug("THE PATH FRAGS");
			self.debug(pathFrags);
			requiredData.handler = pathFrags[0];
		} else {
			requiredData.handler = url;
		}
	} else {
		requiredData.user = {};
		if (isPath) {
			let pathFrags = url.split("/");
			self.debug("THE PATH FRAGS");
			self.debug(pathFrags);
			requiredData.handler = pathFrags[0];
			delete requiredData.user;
		} else {
			requiredData.handler = url;
			delete requiredData.user;
		}
	}
	return requiredData;
};
// eslint-disable-next-line no-unused-vars
export const handleRequestGlobalError = function () {
	const self = this;
	self.writeResponse({
		error: true,
		type: "serverError",
		code: 502,
		message: "The server error",
	});
};
// eslint-disable-next-line no-unused-vars
export const handlePathError = function () {
	const self = this;
	self.writeResponse({
		error: true,
		type: "ServerError",
		code: 502,
		message: "The requested task[handler] could not be completed",
	});
};
export const handleRouterAliasList = function (data) {
	const self = this;
	self.debug("Router ALIATIKHANDLERS WITH DATA:");
	self.debug(data);
	// self.writeResponse({error: true,type: 'ServerError',code: 502,message: 'The requested task[handler] could not be completed'})
	self.routesAliasList = data.aliasList;
	self.aliatikHandlers = data.handlers;
};
export const handleRequestGlobalResponse = function (data) {
	const self = this;
	const res = self.requestData.request.res;
	if (!data) {
		self.handleByHandlerError();
	} else {
		self.emit({
			type: `handle-${self.requestData.handler}-task`,
			data: {
				payload: self.requestData,
				callback: (fail = null, success = null, method = null) => {
					console.log("THE REQUEST ID IN TASKER", res.R_ID);
					self.taskerHandler({ fail, res, success, method });
				},
			},
		});
	}
};
export const isView = function (path, user = null) {
	const self = this;
	let views = self.views;
	self.debug("THE VIEW PATH");
	self.debug(path);
	self.debug(user);
	self.debug(views);
	// self.debug('.extention check status')
	//  self.debug(path.indexOf('.'))
	// if(path.indexOf('.') >= 0) return false
	if (!user && path.trim() === "/home") {
		self.debug("THE PARSED USsER");
		self.debug(self.requestData);
		self.debug(path);
		self.debug(views.indexOf(path) >= 0);
		self.requestData.parsed.derivedUrl = "/home";
		if (views.indexOf(path) >= 0) return true;
		return false;
	} else {
		if (views.indexOf(path) >= 0) return true;
		if (path.indexOf("?") > 0) {
			for (let qv = 0; qv <= views.length; qv++) {
				if (path.indexOf(views[qv]) >= 0 && views[qv] !== "/") {
					self.requestData.parsed.derivedUrl = views[qv];
					return true;
				} else if (qv === views.length - 1) {
					return false;
				}
			}
		}
		let parasList = user ? Object.keys(user) : [];
		let parasString = "";
		self.debug("THE PARALIST");
		self.debug(parasList);
		parasList.forEach((para, i) => {
			i === 0 ? (parasString = `:${para}`) : (parasString += `/:${para}`);
		});
		self.debug("thE PARARSTRING");
		self.debug(parasString);
		for (let v = 0; v < views.length; v++) {
			if (views[v].indexOf(parasString) > 0) {
				let viewPath = views[v].substr(0, views[v].indexOf(parasString));
				let comparePath = viewPath + parasString;
				self.debug("EXTRACTED VIEW PATH");
				self.debug(viewPath);
				self.debug(comparePath);
				self.debug(path);
				self.debug(path.indexOf(viewPath));
				if (path.indexOf(viewPath) >= 0) {
					self.debug("Theviewpath matched");
					self.requestData.parsed.derivedUrl = comparePath;
					return true;
				} else {
					return false;
				}
			}
		}
	}
	return false;
};
export const handleBadRequestError = function () {
	const self = this;
	self.writeResponse({
		error: true,
		type: "BadRequest",
		code: 400,
		message: "Bad Request",
	});
};
export const handleHandlerNotFound = function () {
	const self = this;
	self.writeResponse({
		error: true,
		type: "NotFound",
		code: 404,
		message: "The requested task could not be completed",
	});
};
export const handleByHandlerError = function () {
	const self = this;
	self.writeResponse({
		error: true,
		type: "notFound",
		code: 404,
		message: "The requested task could not be completed",
	});
};
export const handleHandlerError = function () {
	const self = this;
	self.handleHandlerError();
};
export const writeResponse = function (response) {
	const self = this;
	const pao = self.pao;
	// self.debug('THE DATA IN WRITERESPONSE')
	// self.debug(data)
	let { data, method = "regular" } = response;
	if (method === "regular") {
		pao.pa_isString()
			? (data = pao.pa_jsToJson({ text: data }))
			: (data = pao.pa_jsToJson(data));
	}
	self.emit({
		type: "write-server-request-response",
		data: { data: data, res: response.res, method: method },
	});
};
export const taskerHandler = function (handlerFeedback) {
	const self = this;
	const { fail = null, success = null, method = null } = handlerFeedback;
	self.debug("THE TASKER HANDLER");
	self.debug(fail);
	self.debug(method);
	if (fail) {
		self.failureHandle({
			error: true,
			message: fail,
			res: handlerFeedback.res,
		});
	} else if (success) {
		method
			? self.successfullHandle({
					data: success,
					method,
					res: handlerFeedback.res,
			  })
			: self.successfullHandle({ data: success, res: handlerFeedback.res });
	}
};
export const successfullHandle = function (successResponseData) {
	const self = this;
	self.writeResponse(successResponseData);
};
export const failureHandle = function (errorResponseData) {
	const self = this;
	self.writeResponse(errorResponseData);
};
