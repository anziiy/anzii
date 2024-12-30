export const init = function () {
	this.adLog("Global has been initialised");
	this.listens({
		"request-global-request": this.handleRequestGlobalRequest.bind(this),
	});
};
export const handleRequestGlobalRequest = function (data) {
	const self = this;
	self.debug("The Modules: ", self.globals);
	if (self.globals && self.globals.length > 0) {
		if (self.globals.indexOf(data) > -1) {
			self.emit({ type: "request-global-request-response", data: true });
		} else {
			self.emit({ type: "request-global-request-response", data: false });
		}
	} else {
		self.emit({ type: "request-global-request-error", data: false });
	}
};
