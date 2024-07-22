import async from "async";
import fs from "fs";
import { createRequire } from "node:module";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import util from "util";
import * as uuid from "uuid";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);

export const EMAIL = "";
export const PASSWORD = "";
export const PROMPT = process.argv || [];

/** Get the current work directory */
export const p_getWorkingFolder = function () {
	return process.cwd();
};
export const p_o_freeze = function (o) {
	if (!(o instanceof Object)) return null;
	return Object.freeze(o);
};
export const p_clone = function (o) {
	if (!(o instanceof Object)) return null;
	return JSON.parse(JSON.stringify(o));
};
export const p_deepMerge = function (from = null, to = null) {
	if (!(from instanceof Object) || !(to instanceof Object)) return null;
	return { ...from, ...to };
};
export const p_ane = function (obj) {
	if (util.types.isNativeError(obj)) {
		throw obj;
	}
};
// export const p_initArray = moduleExports.p_initArray;
// export const p_escapeRegExp = function (str) {
//   return RegExpUtils.escape(str);
// };
export const p_merge = function (from, to) {
	p_forEach(from, function (val, propName) {
		to[propName] = val;
	});
	return to;
};
export const p_union = function (a, b) {
	var union = {};
	p_merge(a, union);
	p_merge(b, union);
	return union;
};
export const p_getTasks = function (iterable, getTaskFunction) {
	var tasks = [];
	for (var i = 0; i < iterable.length; i++) {
		tasks.push(getTaskFunction(iterable, i));
	}
	return tasks;
};
export const p_wrapTask = function (context, func, argArray) {
	if (!Array.isArray(argArray)) {
		argArray = [];
	}
	return function (callback) {
		argArray.push(callback);
		func.apply(context, argArray);
	};
};
export const p_wrapTimedTask = function (context, func, name, argArray) {
	if (p_isString(argArray)) {
		name = argArray;
		argArray = [];
	}
	var task = p_wrapTask(context, func, argArray);
	return function (callback) {
		var start = Date.now();
		task(function (err, result) {
			callback(err, {
				result: result,
				time: Date.now() - start,
				start: start,
				name: name,
			});
		});
	};
};
export const p_forEach = function (iterable = null, handler = null) {
	if (!iterable || !handler) return false;
	if (!(iterable instanceof Object) || !(handler instanceof Object))
		return false;
	var internalHandler;
	var internalIterable;
	if (Array.isArray(iterable)) {
		internalHandler = handler;
		internalIterable = iterable;
	} else if (p_isObject(iterable)) {
		internalIterable = Object.getOwnPropertyNames(iterable);
		internalHandler = function (propName, i) {
			handler(iterable[propName], propName, iterable, i);
		};
	} else {
		return false;
	}
	//execute native foreach on interable
	internalIterable.forEach(internalHandler);
	return true;
};
// export const p_arrayToHash = moduleExports.p_arrayToHash;
export const p_unikify = function (array) {
	var a = array.concat();
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) a.splice(j--, 1);
		}
	}
	return a;
};
// export const p_arrayToObj = moduleExports.p_arrayToObj;
export const p_objArrayToHash = function (array, hashProp) {
	if (!Array.isArray(array)) {
		return null;
	}
	var hash = {};
	for (var i = 0; i < array.length; i++) {
		hash[array[i][hashProp]] = array[i];
	}
	return hash;
};
export const p_hashToArray = function (obj, hashKeyProp) {
	if (!p_isObject(obj)) {
		return null;
	}
	var doHashKeyTransform = p_isString(hashKeyProp);
	return Object.keys(obj).reduce(function (prev, prop) {
		prev.push(obj[prop]);
		if (doHashKeyTransform) {
			obj[prop][hashKeyProp] = prop;
		}
		return prev;
	}, []);
};
export const p_capitalizeFirstLetter = function (text) {
	// console.log("The text Uppercasing;;;", text);
	return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
};
export const p_capitalizeLastLetter = function (text) {
	// console.log("The text Lowercasing;;;", text);
	return `${text.slice(0, text.length - 1)}${text
		.slice(text.length - 1)
		.toLowerCase()}`;
};
export const p_camelCase = function (text, sep = "-") {
	// console.log("The camelCasing;;;", text);
	if (!sep) return text;
	if (text.indexOf(sep) < 0) return text;

	return `${text
		.split(sep)
		.map((t, i) => {
			if (i === 0) return t;
			return p_capitalizeFirstLetter(t);
		})
		.join("")}`;
};
export const p_invertHash = function (obj) {
	if (!p_isObject(obj)) {
		return null;
	}
	var new_obj = {};
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			new_obj[obj[prop]] = prop;
		}
	}
	return new_obj;
};
export const p_copyArray = function (array) {
	if (!Array.isArray(array)) {
		return null;
	}
	var clone = [];
	for (var i = 0; i < array.length; i++) {
		clone.push(array[i]);
	}
	return clone;
};
export const p_dedupeArray = function (array) {
	var hash = p_arrayToHash(array);
	return Object.keys(hash);
};
export const p_arrayPushAll = function (from, to) {
	if (!Array.isArray(from) || !Array.isArray(to)) {
		return false;
	}
	for (var i = 0; i < from.length; i++) {
		to.push(from[i]);
	}
};
export const p_generateUniqueID = function () {
	return uuid.v4();
};

export const p_getMainFileName = function () {
	// let filename = __non_webpack_require__.main.filename
	// let dir = path.resolve(path.dirname(filename))
	// let dirIndex = filename.indexOf(dir)
	// let nameIndex = 0
	// filename = filename.slice(dirIndex,filename.length)
	// name = filename.slice(dirIndex+1,filename.indexOf('.'))
	// ext = filename.slice(nameIndex,filename.length)
	return null;
};
export const p_getRootDir = function () {
	// let filename = __filename;
	let dir = path.dirname(__filename);
	return dir;
};

// eslint-disable-next-line no-unused-vars
export const p_mkdirs = function (absoluteDirPath, isFileName, cb) {
	const that = this;
	return new Promise((resolve, reject) => {
		if (that.p_isFunction(isFileName)) {
			cb = isFileName;
			isFileName = false;
		}
		if (!that.p_isString(absoluteDirPath)) {
			return reject(new Error("absoluteDirPath must be a valid file path"));
		}
		var pieces = absoluteDirPath.split(path.sep);
		var curr = "";
		var isWindows = os.type().toLowerCase().indexOf("windows") !== -1;
		var tasks = that.p_getTasks(pieces, function (pieces, i) {
			return function (callback) {
				//we need to skip the first one bc it will probably be empty and we
				//want to skip the last one because it will probably be the file
				////// name not a directory.
				var p = pieces[i];
				if (p.length === 0 || (isFileName && i >= pieces.length - 1)) {
					return callback();
				}
				curr += (isWindows && i === 0 ? "" : path.sep) + p;
				fs.exists(curr, function (exists) {
					if (exists) {
						return callback();
					}
					fs.mkdir(curr, callback);
				});
			};
		});
		async.series(tasks, function (err /*, results*/) {
			if (err) return reject(err);
			resolve(true);
		});
	});
	// const that = this
	// if (that.p_isFunction(isFileName)) {
	//     cb = isFileName;
	//     isFileName = false;
	// }
	// if (!that.p_isString(absoluteDirPath)) {
	//     return cb(new Error('absoluteDirPath must be a valid file path'));
	// }
	// var pieces = absoluteDirPath.split(path.sep);
	// var curr      = '';
	// var isWindows = os.type().toLowerCase().indexOf('windows') !== -1;
	// var tasks     = that.p_getTasks(pieces, function(pieces, i) {
	//     return function(callback) {
	//         //we need to skip the first one bc it will probably be empty and we
	//         //want to skip the last one because it will probably be the file
	//         //name not a directory.
	//         var p = pieces[i];
	//         if (p.length === 0 || (isFileName && i >= pieces.length - 1)) {
	//             return callback();
	//         }
	//         curr += (isWindows && i === 0 ? '' : path.sep) + p;
	//         fs.exists(curr, function(exists) {
	//             if (exists) {
	//                 return callback();
	//             }
	//             fs.mkdir(curr, callback);
	//         });
	//     }
	// });
	// async.series(tasks, function(err/*, results*/){
	//     cb(err);
	// });
};
/**
 * Synchronously makes the specified directory structure.
 * @static
 * @method mkdirsSync
 * @param {String} absoluteDirPath The absolute path of the directory structure
 * to be created
 * @param {Boolean} isFileName When true the value after the last file
 * separator is treated as a file.  This means that a directory with that value
 * will not be created.
 */
export const p_mkdirsSync = function (absoluteDirPath, isFileName) {
	const that = this;
	if (!that.p_isString(absoluteDirPath)) {
		throw new Error("absoluteDirPath must be a valid file path");
	}
	var pieces = absoluteDirPath.split(path.sep);
	var curr = "";
	var isWindows = os.type().toLowerCase().indexOf("windows") !== -1;
	pieces.forEach(function (p, i) {
		//we need to skip the first one bc it will probably be empty and we
		//want to skip the last one because it will probably be the file
		//name not a directory.
		if (p.length === 0 || (isFileName && i >= pieces.length - 1)) {
			return;
		}
		curr += (isWindows && i === 0 ? "" : path.sep) + p;
		if (!fs.existsSync(curr)) {
			fs.mkdirSync(curr);
		}
	});
};
// export const p_isObject = moduleExports.p_isObject;
// export const p_isString = moduleExports.p_isString;
// export const p_isFunction = moduleExports.p_isFunction;
export const p_isNullOrUndefined = function (value) {
	return value === null || typeof value === "undefined";
};
export const p_isBoolean = function (value) {
	return value === true || value === false;
};
// export const p_getDirectories = moduleExports.p_getDirectories;
// export const p_getFiles = moduleExports.p_getFiles;
// export const p_getFile = moduleExports.p_getFile;
export function // p_isDirectory(item){
// },
p_isExistingDir(filePath) {
	// console.log("THE EXISTANCE PATH", filePath);
	const checkResults = fs.existsSync(filePath);
	// console.log("existence results", checkResults);
	return checkResults;
}
export const p_makeFolderSync = function (absolutePath) {
	return fs.mkdirSync(absolutePath);
};
// export const p_createFolderContent = moduleExports.p_createFolderContent;
// export const p_loadFile = moduleExports.p_loadFile;
export const p_saveToFile = function (fileToSaveTo, contents) {
	// const contents = fs.readFileSync(origFilePath, 'utf8');
	const writePath = `${fileToSaveTo}`;
	// console.log("saveToFile", writePath);
	fs.writeFileSync(writePath, contents, "utf8");
};
export function p_wiLog(message) {
	if (!process.env.ANZII_SHOW_WILD_LOGS) return;
	if (process.env.ANZII_SHOW_WILD_LOGS.trim().toLowerCase() === "false") return;
	console.log(message);
}
// export const p_getMainFileName = moduleExports.p_getMainFileName;
// export const p_getRootDir = moduleExports.p_getRootDir;
// export const p_mkdirs = moduleExports.p_mkdirs;
// export const p_mkdirsSync = moduleExports.p_mkdirsSync;
// export const p_getExtension = moduleExports.p_getExtension;
export const p_getFileExtensionFilter = function (extension) {
	var ext = "." + extension;
	return function (fullPath) {
		return fullPath.lastIndexOf(ext) === fullPath.length - ext.length;
	};
};
export const p_inherits = function (Type1, Type2) {
	if (p_isNullOrUndefined(Type1) || p_isNullOrUndefined(Type2)) {
		throw new Error("The type parameters must be objects or prototypes");
	}
	util.inherits(Type1, Type2);
	p_merge(Type2, Type1);
};
export const js_to_json = function (jsObject) {
	var jsonString = JSON.stringify(jsObject);
	return jsonString;
};
export const json_to_js = function (jsonString) {
	var jsObject = JSON.parse(jsonString);
	return jsObject;
};
// export const clone = moduleExports.clone;
// export const object_to_array = moduleExports.object_to_array;
// export const array_to_object = moduleExports.array_to_object;
// export const string_to_array = moduleExports.string_to_array;
// export const set_deeply = moduleExports.set_deeply;
export const get_deeply = function () {};
export const is_function = function (x) {
	return Object.prototype.toString.call(x) === "[object Function]";
};
export const is_array = function (x) {
	return Object.prototype.toString.call(x) === "[object Array]";
};
export const is_date = function (x) {
	return Object.prototype.toString.call(x) === "[object Date]";
};
export const is_object = function (x) {
	return Object.prototype.toString.call(x) === "[object Object]";
};
export const is_string = function (x) {
	return Object.prototype.toString.call(x) === "[object String]";
};
// export const is_value = moduleExports.is_value;
// export const is_not_falsey = moduleExports.is_not_falsey;
export const trim_spaces = function (x) {
	if (x instanceof String) {
		return x.trim();
	} else {
		return x;
	}
};
// export const compare_values = moduleExports.compare_values;
// export const is_equal_ab = moduleExports.is_equal_ab;
export const is_valid_email = function () {
	return true;
};
export const is_valid_password = function () {
	return true;
};
// export const is_same_value = moduleExports.is_same_value;
export const unlike_props = function (a, b) {
	let akeys = Object.keys(a);
	let bkeys = Object.keys(b);
	if (a.length > b.length) {
		let unlike = null;
		for (let k of akeys) {
			if (a[k] !== b[k]) {
				if (unlike) {
					unlike.a.push(k);
				} else {
					unlike = { a: [k] };
				}
			}
		}
		return unlike;
	} else {
		let unlike = null;
		for (let k of bkeys) {
			if (b[k] !== a[k]) {
				if (unlike) {
					unlike.b.push(k);
				} else {
					unlike = { b: [k] };
				}
			}
		}
		return unlike;
	}
};
export const throwErrors = function (errorMessage) {
	throw new Error(errorMessage);
};
// export const contains = moduleExports.contains;
// export const for_of = moduleExports.for_of;
// export const add_values_to = moduleExports.add_values_to;
// export const find_in = moduleExports.find_in;

/**
 * Initializes an array with the specified number of values.  The value at each
 * index can be static or a function may be provided.  In the event that a
 * function is provided the function will be called for each item to be placed
 * into the array.  The return value of the function will be placed into the
 * array.
 * @static
 * @method initArray
 * @param {Integer} cnt The length of the array to create
 * @param {Function|String|Number} val The value to initialize each index of
 * the array
 * @return {Array} The initialized array
 */
export const p_initArray = function (cnt, val) {
	var v = [];
	var isFunc = this.p_isFunction(val);
	for (var i = 0; i < cnt; i++) {
		v.push(isFunc ? val(i) : val);
	}
	return v;
};

/**
 * Hashes an array
 * @static
 * @method arrayToHash
 * @param {Array} array      The array to hash
 * @param {*} [defaultVal =true] Default value if the hashing fails
 * @return {Object} Hash
 */
export const p_arrayToHash = function (array, defaultVal) {
	if (!Array.isArray(array)) {
		return null;
	}
	//set the default value
	if (p_isNullOrUndefined(defaultVal)) {
		defaultVal = true;
	}
	var hash = {};
	for (var i = 0; i < array.length; i++) {
		if (this.p_isFunction(defaultVal)) {
			hash[defaultVal(array, i)] = array[i];
		} else {
			hash[array[i]] = defaultVal;
		}
	}
	return hash;
};
/**
 * Converts an array to an object.
 * @static
 * @method arrayToObj
 * @param {Array} array The array of items to transform from an array to an
 * object
 * @param {String|Function} keyFieldOrTransform When this field is a string it
 * is expected that the array contains objects and that the objects contain a
 * property that the string represents.  The value of that field will be used
 * as the property name in the new object.  When this parameter is a function
 * it is passed two parameters = the array being operated on and the index of
 * the current item.  It is expected that the function will return a value
 * representing the key in the new object.
 * @param {String|Function} [valFieldOrTransform] When this value is a string
 * it is expected that the array contains objects and that the objects contain
 * a property that the string represents.  The value of that field will be used
 * as the property value in the new object.  When this parameter is a function
 * it is passed two parameters = the array being operated on and the index of
 * the current item.  It is expected that the function return a value
 * representing the value of the derived property for that item.
 * @return {Object} The converted array.
 */
export const p_arrayToObj = function (
	array,
	keyFieldOrTransform,
	valFieldOrTransform,
) {
	if (!Array.isArray(array)) {
		return null;
	}
	var keyIsString = p_isString(keyFieldOrTransform);
	var keyIsFunc = this.p_isFunction(keyFieldOrTransform);
	if (!keyIsString && !keyIsFunc) {
		return null;
	}
	var valIsString = p_isString(valFieldOrTransform);
	var valIsFunc = this.p_isFunction(valFieldOrTransform);
	if (!valIsString && !valIsFunc) {
		valFieldOrTransform = null;
	}
	var obj = {};
	for (var i = 0; i < array.length; i++) {
		var item = array[i];
		var key = keyIsString
			? item[keyFieldOrTransform]
			: keyFieldOrTransform(array, i);
		if (valIsString) {
			obj[key] = item[valFieldOrTransform];
		} else if (valIsFunc) {
			obj[key] = valFieldOrTransform(array, i);
		} else {
			obj[key] = item;
		}
	}
	return obj;
};

/**
 * Tests if a value is an object
 * @static
 * @method isObject
 * @param {*} value
 * @return {Boolean}
 */
export const p_isObject = function (value) {
	return !p_isNullOrUndefined(value) && typeof value === "object";
};
/**
 * Tests if a value is an string
 * @static
 * @method isString
 * @param {*} value
 * @return {Boolean}
 */
export const p_isString = function (value) {
	const that = this;
	return !that.p_isNullOrUndefined(value) && typeof value === "string";
};
/**
 * Tests if a value is a function
 * @static
 * @method isFunction
 * @param {*} value
 * @return {Boolean}
 */
export const p_isFunction = function (value) {
	return !this.p_isNullOrUndefined(value) && typeof value === "function";
};
/**
 * Retrieves the subdirectories of a path
 * @static
 * @method getDirectories
 * @param {String}   dirPath The starting path
 * @param {Function} cb      Callback function
 */
export const p_getDirectories = function (dirPath) {
	const that = this;
	return new Promise((resolve, reject) => {
		var dirs = [];
		fs.readdir(dirPath, function (err, files) {
			if (util.types.isNativeError(err)) {
				return reject(err);
			}
			var tasks = that.p_getTasks(files, function (files, index) {
				return function (callback) {
					var fullPath = path.join(dirPath, files[index]);
					fs.stat(fullPath, function (err, stat) {
						if (util.types.isNativeError(err)) {
							return reject(err);
						}
						if (that.p_isNullOrUndefined(stat)) {
							this.p_wiLog(
								"WARN: Util: unstatable file encountered: %s",
								fullPath,
							);
						} else if (stat.isDirectory()) {
							dirs.push(fullPath);
						}
						callback(err);
					});
				};
			});
			async.parallel(tasks, function (/*, results*/) {
				resolve(dirs);
			});
		});
	});
};
/**
 * Retrieves file and/or directorie absolute paths under a given directory path.
 * @static
 * @method getFiles
 * @param {String} dirPath The path to the directory to be examined
 * @param {Object} [options] Options that customize the results
 * @param {Boolean} [options.recursive=false] A flag that indicates if
 * directories should be recursively searched.
 * @param {Function} [options.filter] A function that returns a boolean
 * indicating if the file should be included in the result set.  The function
 * should take two parameters.  The first is a string value representing the
 * absolute path of the file.  The second is the stat object for the file.
 * @param {Function} cb A callback that takes two parameters. The first is an
 * Error, if occurred. The second is an array of strings representing the
 * absolute paths for files that met the criteria specified by the filter
 * function.
 */
export const p_getFiles = function (dirPath, options, fileName) {
	let that = this;
	// console.log('gETTING FILES')
	// console.log(dirPath)
	// console.log(options)
	return new Promise((resolve, reject) => {
		// if (this.p_isFunction(options)) {
		//     cb      = options;
		//     options = {
		//         recursive: false,
		//         filter: function(/*fullPath, stat*/) { return true; }
		//     }
		// }
		// if(!options){
		//     options = {
		//         recursive: false,
		//         filter: function(/*fullPath, stat*/) { return true; }
		//     }
		// }
		that.p_wiLog("The directory path");
		that.p_wiLog(dirPath);
		that.p_wiLog(fileName);
		// console.log(fileName)
		//read files from dir
		fs.readdir(dirPath, function (err, q) {
			if (util.types.isNativeError(err)) {
				return reject(err);
			}
			that.p_wiLog("The readdir results q");
			that.p_wiLog(q);
			// console.log(q)
			let filePaths = [];
			//seed the queue with the absolute paths not just the file names
			for (var i = 0; i < q.length; i++) {
				// that.p_wiLog(q[i])
				// q[i] = path.join(dirPath, q[i]);
				filePaths.push(path.join(dirPath, q[i]));
			}
			//process the q
			// console.log(q)
			// console.log(filePaths)
			if (filePaths.indexOf(path.join(dirPath, fileName)) !== -1) {
				that.p_wiLog("THE IS A NEED FOR A SPECIFIC FILE");
				// let filePathCont = filePaths[filePaths.indexOf(filePath)]
				// let file = filePathCont.substr(filePath.indexOf(fileName),filePathCont.length - 1)
				// that.p_wiLog(filePathCont)
				// that.p_wiLog(file)
				let file = filePaths[filePaths.indexOf(path.join(dirPath, fileName))];
				// console.log('THE FILE')
				// console.log(file)
				return resolve(file);
			} else {
				return resolve(null);
			}
			// for(let p =0; p < filePaths.length; p++){
			//     if(filePaths.indexOf(filePath) !== -1){
			//         that.p_wiLog('THE IS A NEED FOR A SPECIFIC FILE')
			//         let filePathCont = filePaths[filePaths.indexOf(filePath)]
			//         let file = filePathCont.substr(filePath.indexOf(fileName),filePathCont.length - 1)
			//         that.p_wiLog(filePathCont)
			//         that.p_wiLog(file)
			//         resolve(file)
			//     }else{
			//         resolve(filePaths);
			//     }
			// }
			//  var filePaths = [];
			// async.whilst(
			//     function() {
			//         console.log('THE Q LENGTH')
			//         console.log(q.length)
			//         console.log(q.length)
			//         return q.length > 0; }
			//     function(callback) {
			//         console.log('The second with ca')
			//         console.log(callback)
			//         var fullPath = q.shift();
			//         fs.stat(fullPath, function(err, stat) {
			//             if (util.types.isNativeError(err)) {
			//                 console.log('THERE ERROR')
			//                 return callback(err);
			//             }
			//             //apply filter
			//             var meetsCriteria = true;
			//             if (that.p_isFunction(options.filter)) {
			//                 meetsCriteria = options.filter(fullPath, stat);
			//             }
			//             //examine result and add it when criteria is met
			//             if (meetsCriteria) {
			//                 filePaths.push(fullPath);
			//             }
			//             //when recursive queue up directory's for processing
			//             if (!options.recursive || !stat.isDirectory()) {
			//                 return callback(null);
			//             }
			//             //read the directory contents and append it to the queue
			//             fs.readdir(fullPath, function(err, childFiles) {
			//                 if (util.types.isNativeError(err)) {
			//                     return callback(err);
			//                 }
			//                 childFiles.forEach(function(item) {
			//                     q.push(path.join(fullPath, item));
			//                 });
			//                 callback(null);
			//             });
			//         });
			//     }
			//     function(err) {
			//         console.log('THE FILES ARRAY')
			//         console.log(err)
			//         that.p_wiLog('THE FILES ARRay')
			//         let filePath = dirPath+path.sep+fileName
			//         that.p_wiLog(filePath)
			//         if(filePaths.indexOf(filePath) !== -1){
			//             that.p_wiLog('THE IS A NEED FOR A SPECIFIC FILE')
			//             let filePathCont = filePaths[filePaths.indexOf(filePath)]
			//             let file = filePathCont.substr(filePath.indexOf(fileName),filePathCont.length - 1)
			//             that.p_wiLog(filePathCont)
			//             that.p_wiLog(file)
			//             resolve(file)
			//         }else{
			//             resolve(filePaths);
			//         }
			//     }
			// );
		});
	});
};
export const p_getFile = function (filePath) {
	return new Promise((resolve) => {
		this.p_wiLog("The directory path");
		this.p_wiLog(filePath);
		//read files from dir
		var s = fs.createReadStream(filePath);
		if (s) {
			resolve(s);
		}
	});
};
export const p_createFolderContent = function (
	sourcePath,
	savePath,
	ignore = null,
) {
	// console.log("CREATE FOLDER CONTENT SOURCE", sourcePath)
	const self = this;
	const CURR_DIR = self.p_getWorkingFolder();
	const filesToCreate = fs.readdirSync(sourcePath);
	// console.log("CREATE FOLDER CONTENT CURR_DI",CURR_DIR)
	// console.log("CREATE FOLDER CONTENT FILES TO CREATE", filesToCreate)
	// console.log("CREATE FOLDER CONTENT FILES TO IGNORE", ignore)
	filesToCreate.forEach((file) => {
		const origFilePath = `${sourcePath}/${file}`;
		// console.log("CREATE FOLDER CONTENT Original File pATH", origFilePath)
		// Get file statitics
		const stats = fs.statSync(origFilePath);
		let skip = false;
		if (stats.isFile()) {
			// let fileBaseName = path.basename(origFilePath)
			// console.log("CREATE FOLDER CONTENT writepath pATH", fileBaseName)
			// console.log("CREATE FOLDER CONTENT file", file)
			if (ignore && this.contains(ignore, file)) skip = true;
			if (!skip) {
				const contents = fs.readFileSync(origFilePath, "utf8");
				const writePath = `${CURR_DIR}/${savePath}/${file}`;
				// console.log("CREATE FOLDER CONTENT writepath pATH", origFilePath)
				fs.writeFileSync(writePath, contents, "utf8");
			}
		} else if (stats.isDirectory()) {
			// console.log("THE FOLDER", file)
			if (ignore && this.contains(ignore, file)) skip = true;
			if (!skip) {
				fs.mkdirSync(`${CURR_DIR}/${savePath}/${file}`);
				// recursive call
				self.p_createFolderContent(
					`${sourcePath}/${file}`,
					`${savePath}/${file}`,
				);
			}
		}
	});
};
export const p_loadFile = function (filepath, all = false, checkExist = true) {
	return new Promise((resolve, reject) => {
		this.p_wiLog(`THE FILEPATH load,${filepath}`);
		if (checkExist && !p_isExistingDir(filepath))
			return reject({
				code: "FILE_PATH_ERROR",
				message: "File path does not exist",
				filePath: filepath,
			});
		const ext = path.extname(filepath);
		this.p_wiLog(`FILE EXTENSION, ${ext}`);

		if (ext === ".json") {
			try {
				const readJson = p_readFileSync(filepath);
				this.p_wiLog(`THE READ JSON, ${readJson}`);
				return resolve(readJson);
			} catch (err) {
				console.log("failed to findJSON", err.code);
				return reject(err);
			}
			// import(`${filepath}`, {
			//     with: { type: 'json' }
			//   }).then((foundJson)=>{
			//     console.log("JSON WAS FOUND")
			//     return resolve(foundJson)
			//   }).catch((err)=>{
			//     try{
			//         const readJson = p_readFileSync(filepath)
			//         console.log("THE READ JSON",readJson)
			//         return resolve(readJson)
			//     }
			//     catch(err){
			//         console.log("failed to findJSON",err.code)
			//         return reject(err)
			//     }

			//   });
		}
		import(filepath)
			.then((moduleFound) => {
				// console.log("THE FOUND MODULE", moduleFound);
				let foundFileContent = moduleFound?.default || moduleFound;
				resolve(foundFileContent);
			})
			.catch((importERR) => {
				// console.log("IMPORT ERROR", importERR);
				try {
					const readFile = p_loadFileSync(filepath);
					this.p_wiLog(`THE READ FILE, ${JSON.stringify(readFile)}`);
					return resolve({ default: readFile });
				} catch (err) {
					this.p_wiLog(`MODULE FETCH ERROR, ${err.code}`);
					return reject(err);
				}
				// console.log("MODULE FETCH ERROR", err);
				// reject(err);
			});
	});

	// console.log('THE FILEPATH')
	// console.log(filepath)
	// console.log(__non_webpack_require__.main)
	// eslint-disable-next-line no-undef
};
export const p_loadFileSync = function (filepath) {
	//if(!p_isExistingDir(filepath) || filepath !== "@babel/register" || filepath !== "babel-register") return ({code:"FILE_PATH_ERROR",message:"File path does not exist",filePath:filepath})
	// console.log("REQUIRE'S");
	const foundFile = require(filepath);
	// console.log("THE FILE FOUND FROM REQUIRE", foundFile);
	return foundFile;
};

export const p_readFileSync = function (filepath) {
	if (!p_isExistingDir(filepath)) return null;
	return fs.readFileSync(filepath, {
		encoding: "utf8",
	});
};

/**
 * Retrieves the extension off of the end of a string that represents a URI to
 * a resource
 * @static
 * @method getExtension
 * @param {String} filePath URI to the resource
 * @param {Object} [options]
 * @param {Boolean} [options.lower=false] When TRUE the extension will be returned as lower case
 * @param {String} [options.sep] The file path separator used in the path.  Defaults to the OS default.
 * @return {String} The value after the last '.' character
 */
export const p_getExtension = function (filePath, options) {
	const that = this;
	if (!that.p_isString(filePath) || filePath.length <= 0) {
		return null;
	}
	if (!that.p_isObject(options)) {
		options = {};
	}
	//do to the end of the path
	var pathPartIndex = filePath.lastIndexOf(options.sep || path.sep) || 0;
	if (pathPartIndex > -1) {
		filePath = filePath.substr(pathPartIndex);
	}
	var ext = null;
	var index = filePath.lastIndexOf(".");
	if (index >= 0) {
		ext = filePath.substring(index + 1);
		//apply options
		if (options.lower) {
			ext = ext.toLowerCase();
		}
	}
	return ext;
};
export const clone = function (o) {
	if (o instanceof Array) {
		let newA = [];
		o.forEach((e) => {
			if (e instanceof Array) {
				newA.push(this.clone(e));
			} else if (e instanceof Object) {
				newA.push(this.clone(e));
			} else {
				newA.push(e);
			}
		});
		return newA;
	} else if (o instanceof Object && typeof o !== "function") {
		let n = {};
		for (let p in o) {
			if (o[p] instanceof Array) {
				n[p] = this.clone(o[p]);
			} else if (o[p] instanceof Object && typeof o[p] !== "function") {
				n[p] = this.clone(o[p]);
			} else {
				if (p === "callback") {
					this.p_wiLog("The current property is callback");
				}
				n[p] = o[p];
			}
		}
		return n;
	}
};
/*********************************** OBJECT AND ARRAY CASTING ************************************************************/
export const object_to_array = function (castObj, keys = false) {
	// this.p_wiLog('THE CAST OBJECT')
	// this.p_wiLog(castObj)
	if (castObj instanceof Object) {
		if (!(castObj instanceof Array)) {
			var arr = [];
			var count = 0;
			if (keys) {
				for (let key in castObj) {
					arr[count] = { key: key, value: castObj[key] };
					++count;
				}
			} else {
				for (let key in castObj) {
					arr[count] = castObj[key];
					++count;
				}
			}
			//    this.p_wiLog('THE RETURN OF CONVERTED OBJECT')
			//    this.p_wiLog(arr)
			return arr;
		} else {
			return castObj;
		}
	} else {
		this.throwErrors("Argument 1 of object_to_array() must be an object");
	}
};
export const array_to_object = function (castArr) {
	if (castArr instanceof Array) {
		var obj = {};
		for (var i = 0; i < castArr.length; i++) {
			var property = "property_" + (i + 1);
			obj[property] = castArr[i];
		}
		return obj;
	} else {
		this.throwErrors("Argument 1 of array_to_object() must be an array");
	}
};
export const string_to_array = function (string, sep) {
	// this.p_wiLog('STRING TO ARRAY')
	// this.p_wiLog(string)
	// this.p_wiLog(sep)
	if (this.is_string(string)) {
		// this.p_wiLog('THE STRING IS AN INSTANCE OF STRING')
		return string.split(sep);
	}
};
export const set_deeply = function (path, deep, value = null, type = null) {
	//  this.p_wiLog('TYPEOF AC')
	//  this.p_wiLog(ac)
	// if(!(ac)){
	// 	this.p_wiLog('AC IS NULL')
	// 	var a = deep
	// }
	// this.p_wiLog('THE VALUE OF A')
	// this.p_wiLog(a)
	if (path.length === 1) {
		this.p_wiLog("ABOUT TO SET DEEPLY NESTED PROP");
		this.p_wiLog("THE DEEP");
		this.p_wiLog(deep);
		if (!value) {
			this.p_wiLog("THIS DEEP ARRAY");
			this.p_wiLog(this.js_to_json(deep));
			this.p_wiLog("THE DEEP I,i");
			deep.splice(path[0], 1);
			this.p_wiLog(deep);
		} else {
			deep[path[0]] = value;
		}
		this.p_wiLog(path);
		this.p_wiLog(path[0]);
		this.p_wiLog(deep[path]);
		return true;
	}
	if (!deep[path[0]]) {
		this.p_wiLog("THE PROPERTY BELOW DOES NOT EXIST");
		this.p_wiLog(path);
		this.p_wiLog(path[0]);
		//  this.p_wiLog(deep[path[0]])
		return false;
	}
	return this.set_deeply(path.slice(1), deep[path[0]], value, type);
};

export const is_value = function (x) {
	return !this.isObject(x) && !this.isArray(x);
};
export const is_not_falsey = function (x) {
	if (this.trim_spaces(x)) {
		return true;
	} else {
		return false;
	}
};
export const compare_values = function (value1, value2) {
	if (value1 === value2) {
		return;
	}
	if (
		this.is_date(value1) &&
		this.is_date(value2) &&
		value1.getTime() === value2.getTime()
	) {
		return;
	}
	if (value1 !== value2) {
		value1 = value2;
		return;
	}
};
export const is_equal_ab = function (a, b, flag = "values") {
	if (!(this.is_object(a) && this.is_object(b))) {
		return false;
	}
	if (Object.keys(a).length !== Object.keys(b).length) {
		return false;
	}
	if (flag.trim() === "keys") {
		var bKeys = Object.keys(b).sort();
		var aKeys = Object.keys(a).sort();
		return JSON.stringify(aKeys) === JSON.stringify(bKeys);
		// var akeys = Object.keys(a)
		// for (let k of akeys) {
		// 	if (a[k] !== b[k]) {
		// 	return false;
		// 	}
		// }
		// return true
	} else {
		if (!(this.js_to_json(a) === this.js_to_json(b))) {
			return false;
		} else {
			return true;
		}
	}
};
export const is_same_value = function (x, y) {
	if (this.isBrowserSupported("Object", "is")) {
		return Object.is(x, y);
	} else {
		return this.polyFills().objectIs(x, y);
	}
};
export const contains = function (o, v) {
	if (this.is_array(o)) {
		return o.indexOf(v) > -1 ? true : false;
	} else if (this.is_object(o)) {
		if (this.is_array(v)) {
			this.p_wiLog("THE SPECIFED VALUE TO CHECK IS AN ARRAY");
			this.p_wiLog(v);
			let outcome = "";
			for (let i = 0; i < v.length; i++) {
				if (!o.hasOwnProperty(v[i])) {
					outcome = false;
					break;
				} else if (i === v.length - 1) {
					outcome = true;
				}
			}
			this.p_wiLog("THE OUTCOME");
			this.p_wiLog(outcome);
			return outcome;
		} else {
			return o.hasOwnProperty(v) ? true : false;
		}
	} else {
		this.throwErrors("Contains() requires either an array pure js object");
	}
};
export const for_of = function (x, action, y = null) {
	x = this.clone(x);
	if (this.is_array(x)) {
		x.forEach(action);
	} else if (this.is_object(x)) {
		if (!y) {
			// this.p_wiLog('THE FOROF Y IS NULL')
			// this.p_wiLog(x)
			// this.p_wiLog('THE Y IS DEFINED')
			let newX = {};
			for (let p in x) {
				let prop = action(p, x[p]);
				newX[prop.p] = prop.v;
			}
			// this.p_wiLog('THE NEWX')
			// this.p_wiLog(newX)
			return newX;
		} else {
			for (let p in x) {
				action(p, x[p]);
			}
		}
	} else {
		this.throwErrors("Object of for_of() must be an Array or pure object");
	}
};
export const add_values_to = function (x, keys, values, action = () => {}) {
	if (this.is_array(x)) {
		x.forEach(action);
	} else if (this.is_object(x)) {
		keys.forEach((k) => {
			let vItemKeys = Object.keys(values[k]);
			if (x[k]) {
				vItemKeys.forEach((v) => {
					x[k][v] = values[v];
				});
			} else {
				x[k] = {};
				vItemKeys.forEach((v) => {
					x[k][v] = values[v];
				});
			}
		});
		return x;
	} else {
		this.throwErrors("Object of for_of() must be an Array or pure object");
	}
};
export const find_in = function (x, id, f) {
	if (this.is_array(x)) {
		if (this.is_value(x[0])) {
			return x.indexOf(f) > -1 ? x[f] : false;
		} else if (this.is_object(x[0])) {
			for (let i = 0; i < x.length; i++) {
				if (contains(x[i], id) && x[i][id] === f) {
					return x[i];
				}
			}
		}
	}
};
