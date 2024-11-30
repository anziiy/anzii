function CORE(lib) {
	this.PILLAR = lib;
	this.modules = {};
	this.globalModules = [];
	this.PROMPT = this.PILLAR.PROMPT;
	// this.parent = this
} // End of the CORE class
CORE.prototype.createModule = function (
	module,
	moduleId,
	modInstId,
	className,
) {
	var modules = this.modules;
	this.sanna().runForModules(module, className);
	// this.PILLAR.p_wiLog('THe modules Object')
	// this.PILLAR.p_wiLog(modules)
	if (Object.keys(modules).length > 0) {
		for (let mod in modules) {
			//this.PILLAR.p_wiLog(modules[mod]);
			if (mod === moduleId) {
				this.modules[moduleId][modInstId] = module;
			} else {
				this.modules[moduleId] = {};
				this.modules[moduleId][modInstId] = module;
			}
		} // End of for loop
	} else {
		this.modules[moduleId] = {};
		this.modules[moduleId][modInstId] = module;
	} // End of ifesleif test
}; // End of store modules method
// CORE.prototype.PROMPT = this.PILLAR.PROMPT
CORE.prototype.events = function () {
	const PILLAR = this.PILLAR;
	//  const parent = this.parent
	return {
		addEventHandler: function (el, ev, handler) {
			if (typeof window === "undefined") {
				return PILLAR.ev_addHandler(el, ev, handler);
			} else {
				PILLAR.ev_addHandler(el, ev, handler);
			}
		},
		removeEventHandler: function (el, ev, handler) {
			PILLAR.ev_removeHandler(el, ev, handler);
		},
		getEvent: function (ev) {
			return PILLAR.getEvent(ev);
		},
		getTarget: function (ev) {
			return PILLAR.getTarget(ev);
		},
		preventNormal: function (ev) {
			PILLAR.preventDefault(ev);
		},
		stopEventBubble: function (ev) {
			PILLAR.stopPropagation(ev);
		}, // End of addEventHandler() method
	};
}; // End of CORE EVENTS manipulation object
CORE.prototype.ajax = function () {
	const PILLAR = this.PILLAR;
	return {
		get: function (url, data, success, failure, type) {
			PILLAR.ajax_get(url, data, success, failure, type);
		},
		post: function (url, data, success, failure, type) {
			PILLAR.ajax_post(url, data, success, failure, type);
		}, // End of ajax post() method
	};
}; // End of CORE AJAX manipulation object
CORE.prototype.validators = function () {
	const PILLAR = this.PILLAR;
	return {
		isFunction: function (x) {
			return PILLAR.is_function(x);
		},
		isArray: function (x) {
			return PILLAR.is_array(x);
		},
		isDate: function (x) {
			return PILLAR.is_date(x);
		},
		isObject: function (x) {
			return PILLAR.is_object(x);
		},
		isString: function (x) {
			return PILLAR.is_string(x);
		},
		isValue: function (x) {
			return PILLAR.is_value(x);
		},
		isNotFalsey: function (x) {
			return PILLAR.is_not_falsey(x);
		},
		trimSpaces: function (x) {
			return PILLAR.trim_spaces(x);
		},
		isEqualab: function (a, b, f = null) {
			return PILLAR.is_equal_ab(a, b, f);
		},
		isSameValue: function (x, y) {
			return PILLAR.is_same_value(x, y);
		},
		isValidEmail: function (e) {
			return PILLAR.is_valid_email(e);
		},
		isValidPassword: function (p) {
			return PILLAR.is_valid_password(p);
		},
		unlikeProps: function (a, b) {
			return PILLAR.unlike_props(a, b);
		},
		contains: function (o, v) {
			return PILLAR.contains(o, v);
		},
		forOf: function (o, action, no) {
			return PILLAR.for_of(o, action, no);
		},
		addValuesTo: function (o, k, v) {
			return PILLAR.add_values_to(o, k, v);
		},
		findIn: function (x, i, f) {
			return PILLAR.find_in(x, i, f);
		},
	};
};
CORE.prototype.util = function () {
	const PILLAR = this.PILLAR;
	return {
		makeDirs: function (p, isFileName, callback) {
			return PILLAR.p_mkdirs(p, isFileName, callback);
		},
		mkdirsSync: function (abs, isFileName, callback) {
			return PILLAR.p_mkdirs(abs, isFileName, callback);
		},
		getFiles: function (p, opts, callback) {
			return PILLAR.p_getFiles(p, opts, callback);
		},
		getFile: function (f) {
			return PILLAR.p_getFile(f);
		},
		getDirectories: function (p) {
			return PILLAR.p_getDirectories(p);
		},
		getExtension: function (f, callback) {
			return PILLAR.p_getExtension(f, callback);
		},
		generateUniqueID: function () {
			return PILLAR.p_generateUniqueID();
		},
		unikify: function (a) {
			return PILLAR.p_unikify(a);
		},
		capitalizeFirstLetter: function (text) {
			return PILLAR.p_capitalizeFirstLetter(text);
		},
		capitalizeLastLetter: function (text) {
			return PILLAR.p_capitalizeLastLetter(text);
		},
		camelCase: function (text) {
			return PILLAR.p_camelCase(text);
		},
		getWorkingFolder: function () {
			return PILLAR.p_getWorkingFolder();
		},
		makeFolderSync: function (absPath) {
			return PILLAR.p_makeFolderSync(absPath);
		},
		createFolderContent: function (source, target, ignore = null) {
			return PILLAR.p_createFolderContent(source, target, ignore);
		},
		loadFile: function (filepath, all = false, checkExist = true) {
			return PILLAR.p_loadFile(filepath, all, checkExist);
		},
		loadFileSync: function (filepath) {
			return PILLAR.p_loadFileSync(filepath);
		},
		readFileSync: function (filepath) {
			return PILLAR.p_readFileSync(filepath);
		},
		saveToFile: function (saveTo, contents) {
			return PILLAR.p_saveToFile(saveTo, contents);
		},
		getMainFileName: function () {
			return PILLAR.p_getMainFileName();
		},
		getRootDir: function (filename = null) {
			return PILLAR.p_getRootDir(filename);
		},

		isExistingDir: function (filepath) {
			return PILLAR.p_isExistingDir(filepath);
		},
		wiLog: function (message = "") {
			return PILLAR.p_wiLog(message);
		},
	};
};
/*

    The methods immediately after this method will be used for module inter communication, which is
    a way that modules communicate with each other indirectly.
    

*/
CORE.prototype.registerEvents = function (
	evts = {},
	module_id = "",
	mod_inst_id = "",
) {
	// this.PILLAR.p_wiLog('THE REGISTER MODULES METHOD')
	// this.PILLAR.p_wiLog(evts)
	// this.PILLAR.p_wiLog(module_id,mod_inst_id)
	if (evts && module_id && mod_inst_id) {
		if (this.modules[module_id][mod_inst_id]) {
			this.modules[module_id][mod_inst_id].events = evts;
		}
	}
}; // End of registerEvents method
CORE.prototype.triggerEvent = function (evt) {
	if (evt) {
		// this.PILLAR.p_wiLog('Event contains data')
		for (let moduId in this.modules) {
			// this.PILLAR.p_wiLog('Modules contains modules')
			if (this.modules.hasOwnProperty(moduId)) {
				// this.PILLAR.p_wiLog('given module belongs to modules object')
				moduId = this.modules[moduId];
				for (let modInst in moduId) {
					// this.PILLAR.p_wiLog('Instances of a given moduleS')
					// this.PILLAR.p_wiLog(moduId[modInst].events.type)
					// this.PILLAR.p_wiLog(evt.type)
					if (moduId[modInst].events && moduId[modInst].events[evt.type]) {
						moduId[modInst].events[evt.type](evt.data);
					} // End of inner if statement
				}
			}
		} // End of for in statement
	} // End of outer evt object check
}; // End of triggerEvent method
CORE.prototype.startModule = function (moduleId, modInstId) {
	var moduleID = moduleId;
	// this.PILLAR.p_wiLog('THE START MODULE')
	// this.PILLAR.p_wiLog(moduleId)
	if (this.modules[moduleID][modInstId]) {
		if (moduleID !== "anziiloger") {
			// this.PILLAR.p_wiLog('not A LOGGER MODULE')
			// this.PILLAR.p_wiLog(this.modules[moduleID][modInstId].getClassName)
			// this.PILLAR.p_wiLog(this.modules[moduleID][modInstId].getClassName())
			//  this.modules['anziiloger']['anziiloger'].setDebugger(this.modules[moduleID][modInstId].constructor.name)
			this.modules["anziiloger"]["anziiloger"].setDebugger(
				this.modules[moduleID][modInstId].getClassName(),
			);
			// this.modules['anziiloger']['anziiloger'].setDebugger(moduleID)
		}
		this.modules[moduleID][modInstId].init();
		if (moduleID === "global") {
			// this.PILLAR.p_wiLog('THE GLOBAL MODULES IS ABOUT TO RECEIVE MODULES')
			// this.PILLAR.p_wiLog(Object.keys(this.modules))
			this.modules[moduleID][modInstId].globals = Object.keys(this.modules);
		}
	}
}; // End of startModule() core method
CORE.prototype.startAllModules = function () {
	for (let mod in this.modules) {
		var modSuper = this.modules[mod];
		for (let modInstId in modSuper) {
			try {
				this.modules[modSuper][modInstId].init();
			} catch (e) {
				// this.PILLAR.p_wiLog(e);
			} // End of try catch
		}
	}
}; // End of startAllModules() core method
CORE.prototype.stopModule = function (moduleId, modInstId) {
	var moduleID = moduleId;
	if (this.modules[moduleID][modInstId]) {
		this.modules[moduleID][modInstId].destroy();
	}
}; // End of stopModule() core method
CORE.prototype.stopAllModules = function () {
	for (let mod in this.modules) {
		var modSuper = this.modules[mod];
		for (let modInstId in modSuper) {
			try {
				this.modules[modSuper][modInstId].destroy();
			} catch (e) {
				// this.PILLAR.p_wiLog(e);
			} // End of try catch
		}
	}
}; // End of stopAllModules() core method
CORE.prototype.converts = function () {
	const PILLAR = this.PILLAR;
	return {
		jsToJson: function (jsObject) {
			return PILLAR.js_to_json(jsObject);
		},
		jsonToJs: function (json) {
			return PILLAR.json_to_js(json);
		},
		clone: function (c) {
			return PILLAR.clone(c);
		},
		objectToArray: function (o = {}, key = false) {
			return PILLAR.object_to_array(o, key);
		},
		stringToArray: function (str, sep) {
			return PILLAR.string_to_array(str, sep);
		},
	};
};
CORE.prototype.sanna = function () {
	const self = this;
	return {
		modules: {
			validators: {
				emit: function (comp) {
					if (!comp.hasOwnProperty("emit")) {
						// this.PILLAR.p_wiLog(self.sanna().modules)
						comp.emit = self.sanna().modules.addiks.emit.bind(comp);
					} else if (typeof comp.emit !== "function") {
						throw new Error("Emit is a reserved Akii method");
					}
				},
				listens: function (comp) {
					// this.PILLAR.p_wiLog('THE COMPONENT RUNS')
					if (!comp.hasOwnProperty("listens")) {
						// this.PILLAR.p_wiLog('THE LISTENS COMP PROP')
						comp.listens = self.sanna().modules.addiks.listens.bind(comp);
						// this.PILLAR.p_wiLog(comp)
					} else if (typeof comp.listens !== "function") {
						throw new Error("Listens is a reserved ANZii method");
					}
				},
				log: function (comp) {
					comp.log = self.sanna().modules.addiks.log.bind(comp);
				},
				logSync: function (comp) {
					comp.logSync = self.sanna().modules.addiks.logSync.bind(comp);
				},
				info: function (comp, name = "") {
					if (name && name.toLowerCase() === "anziiloger") return;
					comp.info = self.sanna().modules.addiks.info.bind(comp);
				},
				infoSync: function (comp) {
					comp.infoSync = self.sanna().modules.addiks.infoSync.bind(comp);
				},
				debug: function (comp, name = "") {
					if (name && name.toLowerCase() === "anziiloger") return;
					comp.debug = self.sanna().modules.addiks.debug.bind(comp);
				},
				warn: function (comp, name = "") {
					if (name && name.toLowerCase() === "anziiloger") return;
					comp.warn = self.sanna().modules.addiks.warn.bind(comp);
				},
				error: function (comp, name = "") {
					if (name && name.toLowerCase() === "anziiloger") return;
					comp.error = self.sanna().modules.addiks.error.bind(comp);
				},
				adLog: function (comp) {
					comp.adLog = self.sanna().modules.addiks.adLog.bind(comp);
				},
				wiLog: function (comp) {
					comp.wiLog = self.sanna().modules.addiks.wiLog.bind(comp);
				},
				getClassName: function (comp) {
					comp.getClassName = self
						.sanna()
						.modules.addiks.getClassName.bind(comp);
				},
				query: function (comp) {
					comp.query = self.sanna().modules.addiks.query.bind(comp);
				},
			},
			addiks: {
				emit: function (data) {
					const pao = this.pao;
					// self.log(self.constructor.name,'is emitting event:',data.type,'with data: ')
					pao.pa_notifyEvent({
						type: data.type,
						data: data.data,
					});
				},
				listens: function (evehandles) {
					const pao = this.pao;
					// this.PILLAR.p_wiLog('THE VALUE OF SELF')
					// this.PILLAR.p_wiLog(self)
					// self.log('MODULE',self.getClassName(), 'listens to event(s):',evehandles)
					// const mId = self.constructor.name.toLowerCase()
					// const mInsId = self.constructor.name.toLowerCase()
					const mId = pao.moduleMeta.moduleId;
					const mInsId = pao.moduleMeta.modInstId;
					// this.PILLAR.p_wiLog('LISTENS METHOD RECEIVED A CALL')
					// this.PILLAR.p_wiLog(pao.moduleMeta)
					// this.PILLAR.p_wiLog(pao.moduleMeta.modInstId)
					// this.PILLAR.p_wiLog(mInsId)
					pao.pa_notifyListen(evehandles, mId, mInsId);
				},
				log: function (message = "No message provided", type = "console") {
					const self = this;
					let data = { message: message, type: type };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				logSync: function (message = "No message provided", type = "console") {
					const self = this;
					let data = { message: message, type: type };
					data.source = self.getClassName();
					data.sync = true;
					self.emit({ type: "anziiloger-log", data: data });
				},
				info: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "info" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				infoSync: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "info" };
					data.source = self.getClassName();
					data.sync = true;
					self.emit({ type: "anziiloger-log", data: data });
				},
				debug: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "debug" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				warn: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "warn" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				error: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "error" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				adLog: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "adLog" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				wiLog: function (message = "No message provided") {
					const self = this;
					let data = { message: message, type: "wiLog" };
					data.source = self.getClassName();
					self.emit({ type: "anziiloger-log", data: data });
				},
				getClassName: function () {
					const pao = this.pao;
					// this.PILLAR.p_wiLog('GET CLASSNAME')
					// this.PILLAR.p_wiLog(pao)
					return pao.moduleMeta.className;
				},
				query: function (model = null, document = null, handler = null) {
					const self = this;
					const pao = self.pao;
					if (!model || !document) {
						throw new Error("Query method missing required parameters");
					} else {
						let modelFrags = pao.pa_isString(model)
							? pao.pa_stringToArray(model, ".")
							: model;
						// this.PILLAR.p_wiLog(pao.pa_stringToArray)
						// this.PILLAR.p_wiLog(modelFrags)
						if (modelFrags.length === 3) {
							let mo = {
								vendor: modelFrags[0],
								table: modelFrags[1],
								operation: modelFrags[2],
							};
							self.emit({
								type: "data-hive-request",
								data: { model: mo, document, handler },
							});
						} else if (
							// eslint-disable-next-line no-constant-condition
							model[1].trim() === "PROCEDURE" ||
							"JOIN" ||
							"SEARCH" ||
							"TRANSACTION" ||
							"UPDATEANDTAKE" ||
							"INSERTANDTAKE" ||
							"DELETEANDTAKE" ||
							"DELETEMULTIPLE"
						) {
							let mo = {
								vendor: modelFrags[0],
								table: modelFrags[1].toLowerCase(),
								operation: modelFrags[1].toLowerCase(),
							};
							self.emit({
								type: "data-hive-request",
								data: { model: mo, document, handler },
							});
						} else {
							// this.PILLAR.p_wiLog('THE ARRAY')
							// this.PILLAR.p_wiLog(modelFrags)
							throw new Error(
								"Query method requires database vendor,table and operation",
							);
						}
					}
				},
			},
		},
		runForModules: function (comp, clname) {
			let validators = this.modules.validators;
			for (let v in validators) {
				validators[v](comp, clname);
			}
		},
	};
};
export default CORE;
