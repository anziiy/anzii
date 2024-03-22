/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
export const init = function () {
	this.adLog("Server has been initialised");
	this.adLog("SERVER IS STARTING UP");
	//   self.pao.pa_wiLog(this.pao)
	//   self.pao.pa_wiLog(this)
	this.listens({
		"config-server": this.handleConfigServer.bind(this),
		"config-domain-resources": this.handleDomainResources.bind(this),
		"write-server-request-response":
			this.handleWriteServerRequestResponse.bind(this),
	});
};
export const handleConfigServer = function (data) {
	const self = this;
	// self.emit({type:'share-middleware',data:''})
	self.emit({
		type: "attach-middleware",
		data: { app: self.http, xpress: self.xpress },
	});
	self.emit({
		type: "attach-routes",
		data: { app: self.http, router: self.router },
	});
	self.emit({ type: "distribute-system-resources", data: "" });
	self.startServer();
};
export const handleDomainResources = function (data = null) {
	const self = this;
	self.pao.pa_wiLog("THE server is emitting system defaults event");
	//Custom to be removed
	self.emit({
		type: "set-domain-defaults",
		data: { app: self.http, xpress: self.xpress },
	});
};
export const startServer = function (data) {
	const self = this;
	// this.startPreRoutes()
	// this.startRouting()
	this.runServer();
};
export const startPreRoutes = function () {
	const self = this;
	self.http.use(self.dependiks.bodyParser.json());
	// self.http.use(function(req, res, next) {
	// 	// self.pao.pa_wiLog(req.body)
	// 	// self.pao.pa_wiLog('Your mobile has reached this code Surprise')
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// 	return next();
	// });
	self.http.use("*.js", function (req, res, next) {
		// self.pao.pa_wiLog(req.body)
		// self.pao.pa_wiLog('Your mobile has reached this code Surprise')
		res.set("content-type", "text/javascript");
		return next();
	});
	self.http.use(self.xpress.static("public"));
};
export const startRouting = function () {
	const self = this;
	//   self.http.get('/smarfo/menu',function(req,res){
	// 	self.pao.pa_wiLog('Request for menu has just been received')
	// 	let categories = require('./jsondb/foodcategories.json');
	// 	return res.send(categories.menu);
	// })
	self.http.get("/todo", self.renderHtml.bind(self));
	self.http.get("/ibr", self.renderHtml.bind(self));
	self.http.get("/home", self.renderHtml.bind(self));
	self.http.use("/", self.renderHtml.bind(self));
};
export const runServer = function () {
	const self = this;
	self.emit({ type: "attach-workers-to-server", data: { app: self.http } });
	// self.http.listen(process.env.PORT || 3000,()=>{
	//   self.log("The Server is listening",'info')
	// })
};
export const renderHtml = function (req, res) {
	const self = this;
	self.pao.pa_wiLog("A request has been made to one of the routes");
	self.pao.pa_wiLog("The html");
	self.pao.pa_wiLog("The request URL");
	self.pao.pa_wiLog(req.url);
	self.request = {
		req: req,
		res: res,
	};
	self.emit({
		type: "address-changed",
		data: {
			url: req.url,
		},
	});
	//    self.pao.pa_wiLog(this)
};
export const handleWriteServerRequestResponse = async function (data) {
	const self = this;
	self.pao.pa_wiLog("THE DATA TO BE SENT TO CLIENT");
	self.pao.pa_wiLog(data.method);
	self.pao.pa_wiLog(data.method === "renderView");
	if (data.method === "stream") {
		return self.streamResponse(data);
	} else if (data.method === "renderView") {
		self.pao.pa_wiLog("THE RENDERVIEW");
		self.pao.pa_wiLog(data);
		let view = data.data.data;
		self.pao.pa_wiLog("MAKING A VIEW request response");
		data.res.set("Connection", "close");
		// self.pao.pa_wiLog(data)
		// self.pao.pa_wiLog(data.method)
		// self.pao.pa_wiLog(data.data)
		// self.pao.pa_wiLog(view)
		// self.pao.pa_wiLog(data.data.type === 'template')
		if (view.type.trim() === "template") {
			self.pao.pa_wiLog("Rendering template view");
			self.pao.pa_wiLog(data.data.view);
			self.pao.pa_wiLog("Rendering inside try");
			self
				.getHtml(data.res, view)
				.then(async (html) => {
					html.success
						? (data.res.status(200).send(html.html),
						  // eslint-disable-next-line no-mixed-spaces-and-tabs
						  // eslint-disable-next-line no-mixed-spaces-and-tabs
						  self.infoSync(
								`SERVER HAS SUCCESSFULLY SENT RESPONSE TO CLIENT WITH RESPONSE ID::${
									data.res.R_ID.split("-")[0]
								}`,
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  ))
						: (data.res.status(200).send(html.html),
						  self.infoSync(
								`SERVER HAS SENT A FAILED RESPONSE BACK TO CLIENT WITH RESPONSE ID::${
									data.res.R_ID.split("-")[0]
								}`,
						  ));
				})
				.catch((e) => {
					data.res.status(200).send(e.html);
				});
			return;
		} else if (view.type === "modular") {
			self.pao.pa_wiLog("rENDEING MODULAR VIEW");
			// self.infoSync(view.view)
			data.res.status(200).send(view.view);
			return self.infoSync(
				`SERVER HAS SUCCESSFULLY SENT RESPONSE TO CLIENT WITH RESPONSE ID::${
					data.res.R_ID.split("-")[0]
				}`,
			);
		}
		// self.streamResponse(data)
	} else {
		data.R_ID
			? self.infoSync(
					`SERVER IS ABOUT TO SEND RESPONSE BACK TO CLIENT WITH RESPONSE ID::${
						data.res.R_ID.split("-")[0]
					}`,
			  )
			: self.infoSync(
					`SERVER IS ABOUT TO SEND RESPONSE BACK TO CLIENT WITH RESPONSE`,
			  );
		await self.adLog(data.data);
		await data.res.set("Connection", "close");
		if (data.data.accepts) {
			switch (data.data.accepts) {
				case "json":
					data.res.status(200).send(data.data);
					break;
				case "html":
					self
						.getHtml(data.res, {
							view: "main/404",
							title: "Page could not be found",
						})
						.then((html) => {
							return data.res.status(200).send(html.html);
						})
						.catch((e) => {
							return data.res.status(200).send(e.html);
						});
					break;
				default:
					data.res.type("txt").status(200).send("Text not found");
			}
		} else {
			data.res.status(200).send(data.data);
		}
		// await data.res.end()
		// // self.pao.pa_wiLog(data.data)
		return await self.log("SERVER HAS SENT A RESPONSE BACK TO CLIENT");
	}
};
export const streamResponse = function (data) {
	const self = this;
	const pao = self.pao;
	// const jsonToJs = pao.pa_jsonToJs
	// let data = jsonToJs(dt)
	// self.pao.pa_wiLog('THE STREAM IS RUNNING')
	// self.pao.pa_wiLog(data)
	const type = self.mimeTypes[data.data.ext];
	let rStream = data.data.rStream;
	const withAttachment = data.data.withAttachment || null;
	if (withAttachment) data.res["withAttachment"] = { ...withAttachment };
	// self.infoSync('Server is processing stream')
	// self.infoSync(rStream)
	// self.infoSync(data)
	rStream.on("open", async function () {
		// self.pao.pa_wiLog('INSIDE ON AND PIPING')
		// self.pao.pa_wiLog(type)
		self.infoSync("THE STREAM IS OPENED");
		data.res.set("Content-Type", type);
		data.res.set("Connection", "close");
		return rStream.pipe(data.res);
		// return await self.log('SERVER HAS SENT A STREAM RESPONSE BACK TO THE CLIENT ENDING REQUEST SOON')
	});
	rStream.on("end", async function () {
		data.res.end();
		// return await self.log('Stream request has been successfully served WITH END')
		return self.infoSync(
			`STREAM REQUEST HAS BEEN SUCCESSFULLY HANDLED WITH RESPONSE ID::${
				data.res.R_ID.split("-")[0]
			}`,
		);
	});
	rStream.on("error", async function (e) {
		self.pao.pa_wiLog("THE ERROR READSTREAM");
		self.pao.pa_wiLog(e);
		data.res.set("Content-Type", "application/json");
		data.res.set("Connection", "close");
		return data.res.status(404).send({ error: true, message: "Not found" });
		// data.res.end();
		// return  await self.log('SERVER HAS SENT A STREAM RESPONSE BACK TO THE CLIENT WITH ERROR')
	});
};
export const getHtml = function (res, view) {
	const self = this;
	const pao = self.pao;
	self.pao.pa_wiLog("THE SET VIEW");
	self.pao.pa_wiLog(view);
	return new Promise((resolve, reject) => {
		let viewda = null;
		let serviceUrl = process?.env?.appEndpoint || "http://localhost:3000";
		view.viewData
			? (viewda = { ...view.viewData, serviceUrl })
			: (viewda = { title: view.title, serviceUrl });
		console.log("THE VIEWDA", viewda);
		res.render(view.view, viewda, (err, html) => {
			if (err) {
				self.pao.pa_wiLog("THE ERROR BELOW OCCURED TRYING TO RENDER VIEW");
				self.pao.pa_wiLog(err);
				res.render("main/500", { title: "Server error" }, (err, html) => {
					if (err)
						return resolve({
							html: "<hl>The page could not be found</h1>",
							success: false,
						});
					return resolve({ html: html, success: true });
				});
				//   data.res.status(404).send({error: true, message: 'The requested view was not found'})
				//   return self.pao.pa_wiLog('SERVER HAS SENT A FAILED RESPONSE BACK TO THE CLIENT::REGULAR')
			} else {
				return resolve({ html: html, success: true });
				// return self.pao.pa_wiLog('SERVER HAS SENT A SUCCESSFULL RESPONSE BACK TO THE CLIENT::REGULAR')
			}
		});
	});
};

export const getHtmlSkeleton = function (html, head = null, scripts = []) {
	const self = this;
	const { serialize } = self;

	return `
		<!doctype html>
		<html>

    <head>
		  <title>${head?.title}</title>
   
    </head>
		<body>
			<div id="root">${html}</div>
			

		</body>
		</html>
    `;
};
