const methods = {};
const pathMatchPattern = /^\.|index|\.[t|j][sx|s]$/g;
methods.init = function () {
	this.adLog("DoBefores has been initialised");

	this.listens({
		"do-befores": this.handleDobefores.bind(this),
		"do-file-routes": this.handleDoFileRoutes.bind(this),
	});
};
methods.handleDoFileRoutes = async function (data) {
	const self = this;
	// console.log("HANDLE FILE ROUTES DATA", data);
	const { payload } = data;
	const { path: filePaths } = payload;
	self.debugs("FILE PATHS", filePaths);
	const pagesPaths = self.getPages(`${filePaths.appPagesFolder}/**/*.jsx`);
	console.log("PAGES PATHS", pagesPaths);
	console.log(
		"PROCESSED",
		self.createRouterComponents(pagesPaths, data.payload.path.appSrc),
	);
};
methods.handleDobefores = async function () {
	//const self = this;
	// console.log("HANDLE FILE ROUTES DATA", data);
	//const { payload } = data;
};
methods.getPages = function (filesToGet) {
	const self = this;
	console.log("FILETS TO GET", filesToGet);
	console.log("GLOBSYNC", self.globSync);
	const files = self.globSync(filesToGet);
	return files;
};
methods.createRouterComponents = function (maps, pathy) {
	const self = this;
	const pao = self.pao;
	const makeFolderSync = pao.pa_makeFolderSync;
	const isExistingDir = pao.pa_isExistingDir;
	console.log("pages paths", maps);
	const dirPath = `${pathy}/components/system`;
	if (!isExistingDir(dirPath)) makeFolderSync(dirPath);
	let compsMaps = maps.map((contextModule) => {
		// const readFile = loadFile(contextModule);
		// console.log("COntext Module", contextModule);
		// console.log("our path", contextModule.replace(/pages/g, "_pages"));
		// saveToFile(contextModule.replace(/pages/g, "_pages"), readFile);
		// self.buildFile(contextModule);
		return self.getItemPathAndFile(contextModule);
	});

	// if (!isExistingDir(`${dirPath}/maps.js`))
	console.log("MAPS OF FILES", compsMaps);
	console.log("Maps of files stringified", JSON.stringify(compsMaps));
	console.log("THE UTIL");
	// compsMaps.map((co, i) => {
	//   console.log("COMPONENTS INSPECTED", util.inspect(co.component));
	// });
	// console.log("COMPONENTS INSPECTED");
	// console.log("THE COMPS", `${compsMaps}`);
	// let builtCode = self.buildStringCode(compsMaps);
	// console.log("ABOUT TO SAVE THE FILE", builtCode.code);

	// saveToFile(`${dirPath}/maps.js`, builtCode.code);

	return compsMaps;
};
methods.getItemPathAndFile = async function (item) {
	console.log("THE PAGES MAPS ITEM", item);

	let gotEndpoint =
		item.indexOf("pages") > 0
			? item.slice(item.indexOf("pages"), item.length)
			: "";
	console.log("Got endpoint", gotEndpoint);
	let patternMatch = gotEndpoint
		.replace("pages", "")
		.replace(pathMatchPattern, "")
		.replace(/\[(.+)\]/g, ":$1")
		.replace(/\[\.{3}.+\]/, "*");
	// .replace(/\/$/, "");
	if (!/^\/$/.test(patternMatch)) {
		console.log("THE PAGES slash only");
		patternMatch = patternMatch.replace(/\/$/, "");
	}
	console.log("THE PAGES matched", patternMatch);
	console.log("THE ITEM", item);
	// fileAsComp = null;
	// await loadFile(item);

	return {
		path: patternMatch,
		component: await import(module),
	};
};
methods.dynamicImport = async function (module) {
	console.log("THE DYNAMI GOT A CALL");
	const open = await import(module);
	return open;
};

methods.buildFile = function (filename, destination, babelOptions = {}) {
	const self = this;
	const fs = self.fs;
	const babel = self.babel;
	const options = Object.assign({}, babelOptions);
	const content = fs.readFileSync(filename, { encoding: "utf8" });

	// console.log("babel", babel);

	// Ignore non-JS files and test scripts
	if (filename) {
		if (filename) {
			options.filename = filename;
			options.presets = ["@babel/preset-react", "@babel/preset-env"];

			console.log("THE FILE NAME", options);
			const result = babel.transform(content, options);
			console.log("BABEL TRANSFORMED", result);

			// return outputFileSync(outputPath, result.code, { encoding: "utf8" });
		}
		// process with postcss if it's a css file
		// if (ext === ".css") {
		//   return execSync(`postcss ${filename} -o ${outputPath}`);
		// }

		// Copy if it's any other type of file
		// return outputFileSync(outputPath, content);
	}

	return false;
};

methods.buildStringCode = function (code, destination, babelOptions = {}) {
	const self = this;
	const babel = self.babel;
	const options = Object.assign({}, babelOptions);

	// const outputPath = path.join(destination, path.basename(filename));
	// console.log("babel", babel);

	// Ignore non-JS files and test scripts

	options.presets = ["@babel/preset-react", "@babel/preset-env"];
	// options.output = destination

	console.log("THE FILE NAME", options);
	const result = babel.transformSync(code, options);
	console.log("BABEL TRANSFORMED", result);

	// const outputPath = path.join(destination, path.basename(filename));

	return result;
};
export default methods;
