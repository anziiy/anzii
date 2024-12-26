/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
export const init = function () {
	this.adLog("Server has been initialised");

	this.listens({
		"config-server": this.handleConfigServer.bind(this),
		"config-domain-resources": this.handleDomainResources.bind(this),
		"write-server-request-response":
			this.handleWriteServerRequestResponse.bind(this),
	});
};
export const handleConfigServer = function (data) {
	const self = this;

	self.emit({
		type: "set-domain-defaults",
		data: { app: self.http, xpress: self.xpress },
	});
	self.emit({
		type: "attach-middleware",
		data: { app: self.http, xpress: self.xpress },
	});
	self.emit({
		type: "attach-routes",
		data: { app: self.http, router: self.router },
	});
	self.emit({ type: "distribute-system-resources", data: "" });
	self.startServer(data);
};
export const handleDomainResources = function (data = null) {
	const self = this;
	self.pao.pa_wiLog("THE server is emitting system defaults event");
	//Custom to be removed
	// self.emit({
	// 	type: "set-domain-defaults",
	// 	data: { app: self.http, xpress: self.xpress },
	// });
};
export const startServer = function (data) {
	const self = this;
	self.runServer(data);
};

export const runServer = function (data) {
	const self = this;
	self.emit({
		type: "attach-workers-to-server",
		data: { app: self.http, system: data },
	});
};

export const handleWriteServerRequestResponse = async function (data) {
	const self = this;

	if (data.method === "stream") {
		return self.streamResponse(data);
	} else if (data.method === "renderView") {
		let view = data.data.data;
		data.res.set("Connection", "close");

		if (view.type.trim() === "template") {
			self
				.getHtml(data.res, view)
				.then(async (html) => {
					if (html.success) {
						data.res.status(200).send(html.html),
							// eslint-disable-next-line no-mixed-spaces-and-tabs
							// eslint-disable-next-line no-mixed-spaces-and-tabs
							self.infoSync(
								`SERVER HAS SUCCESSFULLY SENT RESPONSE TO CLIENT WITH RESPONSE ID::${
									data.res.R_ID.split("-")[0]
								}`,
								// eslint-disable-next-line no-mixed-spaces-and-tabs
							);
					} else {
						data.res.status(404).send(html.html),
							self.infoSync(
								`SERVER HAS SENT A FAILED RESPONSE BACK TO CLIENT WITH RESPONSE ID::${
									data.res.R_ID.split("-")[0]
								}`,
							);
					}
				})
				.catch((e) => {
					data.res.status(500).send(e.html);
				});
			return;
		} else if (view.type === "modular") {
			data.res.status(200).send(view.view);
			return self.infoSync(
				`SERVER HAS SUCCESSFULLY SENT RESPONSE TO CLIENT WITH RESPONSE ID::${
					data.res.R_ID.split("-")[0]
				}`,
			);
		}
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
							return data.res.status(400).send(html.html);
						})
						.catch((e) => {
							return data.res.status(500).send(e.html);
						});
					break;
				default:
					data.res.type("txt").status(400).send("Text not found");
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
	const type = self.mimeTypes[data.data.ext];
	let rStream = data.data.rStream;
	const withAttachment = data.data.withAttachment || null;
	if (withAttachment) data.res["withAttachment"] = { ...withAttachment };

	rStream.on("open", async function () {
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
		data.res.set("Content-Type", "application/json");
		data.res.set("Connection", "close");
		return data.res.status(404).send({ error: true, message: "Not found" });

		// return  await self.log('SERVER HAS SENT A STREAM RESPONSE BACK TO THE CLIENT WITH ERROR')
	});
};
export const getHtml = function (res, view) {
	return new Promise((resolve, reject) => {
		let viewda = null;
		let serviceUrl = process.env.ANZII_APP_URL;

		view?.viewData
			? (viewda = { ...view.viewData, serviceUrl })
			: (viewda = { title: view.title, serviceUrl });

		res.render(view.view, viewda, (err, html) => {
			if (err) {
				res.render("main/500", { title: "Server error" }, (err, html) => {
					if (err)
						return resolve({
							html: "<hl>The page could not be found</h1>",
							success: false,
						});
					return resolve({ html: html, success: true });
				});
			} else {
				return resolve({ html: html, success: true });
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
