export const init = function () {
	this.adLog("Domain has been initialised");
	this.listens({
		"config-domain": this.handleConfigDomain.bind(this),
		"take-premier-system-base": this.handleTakeSystemBase.bind(this),
		"set-domain-defaults": this.handleSetDomainDefaults.bind(this),
	});
};
export const handleSetDomainDefaults = function (data) {
	const self = this;
	const domains = self.domainCandidates;
	const passport = self.passport;

	const path = self.path;
	// self.infoSync("SETTING DOMAIN DEFAULTS");
	// self.debug(`Domain resources data, ${data}`);
	// self.debug(`THE DOMAINS, ${domains}`);
	// self.debug(`THE DOMAINS PASSPORT, ${passport}`);
	// self.debug(`THE PASSPORT, ${self.passportInitialize}`);
	// self.debug(data)
	self.debug(self.system);
	// self.debug(data)
	// self.debug(`OUTPUT PATH", ${data.custom.webpackConfig.output}`);
	// self.debug(`PATH", ${data.custom.webpackConfig.output.path}`);
	if (!domains) return;
	domains.forEach((dumain) => {
		// self.debug("THE DOMAIN SETTInGS");
		// self.debug(dumain);
		if (dumain.name === "views")
			return data.app.set(
				dumain.name,
				path.join(self.system?.DOCUMENT_ROOT, dumain.set),
			);
		if (dumain.name === "static") {
			// self.debug("DOMAIN IS STATIC");
			// self.debug(
			// 	`${path.join(self.system?.DOCUMENT_ROOT)}, ${dumain.set}`,
			// );
			let appRoot = self.system?.DOCUMENT_ROOT;
			let appStaticFull = `${path.join(
				self.system?.DOCUMENT_ROOT,
				dumain.set,
			)}`;
			// console.log("THE APP ROOT", appRoot);
			// console.log("THE APP FULL STATIC", appStaticFull);
			let domainStatic = dumain?.absolute ? dumain.set : appStaticFull;
			// console.log("THE STATIC DOMAIN", domainStatic);
			return data.app.use(data.xpress.static(domainStatic));
		}
		if (dumain.name === "passport") return data.app.use(passport.initialize());
		// if (dumain.name === "webpackDevMiddleware")
		//     return data.app.use(dumain.use(data.custom.compiler, {
		//         publicPath: data.custom.webpackConfig.output.path,
		//         writeToDisk: true
		//     }));
		// if (dumain.name === "webpackHotMiddleware")
		//     return data.app.use(dumain.use(data.custom.compiler));
		data.app.set(dumain.name, dumain.set);
	});
	//data.app.set(, dumain.set);
	// data?.custom?.compiler ? self.hookIntoWebpackCompilation(data.custom.compiler) : null;
};
export const handleConfigDomain = function (data) {
	const self = this;
	self.debug("Configuring Domain");
	self.debug(data);
	self.domainCandidates = data;
};
export const handleTakeSystemBase = function (data) {
	const self = this;
	self.debug("THE SYSTEMBASE HANDLE");
	self.debug(data);
	self.system = data.systemBase;
};
export const hookIntoWebpackCompilation = async function (compiler) {
	compiler.hooks.invalid.tap("invalid", () => {
		self.debug("wEBPACK is compiling....");
	});
	compiler.hooks.done.tap("done", (stats) => {
		self.debug("WEBPACK IS DONE COMPILING");
		self.debug(`${stats.toJson({ all: false, errors: true, warnings: true })}`);
	});
	return true;
};
