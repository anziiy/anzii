import * as methods from "./methods.js";

class SystemHost {
	constructor(pao) {
		this.pao = pao;

		this.init = methods.init;
		this.handleAddHostDomain = methods.handleAddHostDomain;
		this.handleRemoveHostDomain = methods.handleRemoveHostDomain;
		this.addToHostFile = methods.addToHostFile;
		this.removeFromHostFile = methods.removeFromHostFile;
		this.getHostFileLocation = methods.getHostFileLocation;
		this.readFromHostFile = methods.readFromHostFile;
		this.writeToHostFile = methods.writeToHostFile;
	}
}

export default SystemHost;
