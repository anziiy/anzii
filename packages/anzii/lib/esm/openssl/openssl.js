import * as methods from "./methods.js";

class OpenSSL {
	constructor(pao) {
		this.pao = pao;

		this.init = methods.init;
		this.handleCreateSSLCert = methods.handleCreateSSLCert;
		this.runTerminal = methods.runTerminal;
		this.runOptions = methods.runOptions;
	}
}

export default OpenSSL;
