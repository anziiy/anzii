export const init = function () {
	this.startIOShell();
};
export const startIOShell = function () {
	const self = this;
	self.adLog("Starting i/o Shell operations");
	self.emit({ type: "start-io-operations", data: "" });
};
