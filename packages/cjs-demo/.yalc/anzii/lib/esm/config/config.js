import envObserver from "config";
import supportsColor from "supports-color";
import * as methods from "./methods.js";
// const path = require('path')
// const fs = require('fs')
let config = null;
// try {
//   // const conif = fs.readFileSync(`${process.cwd()}${path.sep}.config.js`,'utf-8')
//   const filename = `${process.cwd()}${path.sep}.config.js`
//   // config = conif.default
//   // console.log('Config file has been successfully required')
//   // console.log(conif.replace(/^uFEFF/,''))
//   const jsO = require('/.config.js')
//   // console.log(jsO)
//   // console.log('Config file has been successfully required')
// } catch (error) {
//   // console.log('No configuration file has been configured')
//   // console.log(error)
//   config = null
// }
// const config = require('/confy').default
// import config from '/confy'
// console.log('THE CONFIG IN CONFIG')
// console.log(config)
// Dependecies
if (!process.env.SUPPRESS_NO_CONFIG_WARNING)
	process.env.SUPPRESS_NO_CONFIG_WARNING = "false";
class Config {
	constructor(pao) {
		this.pao = pao;
		this.config = config;
		this.envObserver = envObserver;
		this.supportsColor = supportsColor;
		this.env = "development";
		this.aliases = { development: "dev", production: "prod", staging: "stage" };
		this.init = methods.init;
		this.setLogNamespaces = methods.setLogNamespaces;
		this.getConfigFile = methods.getConfigFile;
		this.configure = methods.configure;
		this.enviroment = methods.enviroment;
		this.handleManualConfig = methods.handleManualConfig;
		this.runAppConfig = methods.runAppConfig;
		this.configLogger = methods.configLogger;
		this.doBefore = methods.doBefore;
		this.mergeConfigs = methods.mergeConfigs;
		this.configReady = methods.configReady;
	}
}
export default Config;
