import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const init = function () {
	console.log("THE OPENSSL has been initialised");
	this.listens({
		"add-host-domain": this.handleAddHostDomain.bind(this),
		"remove-host-domain": this.handleRemoveHostDomain.bind(this),
	});
};

// eslint-disable-next-line no-unused-vars
export const handleAddHostDomain = function (data) {
	// eslint-disable-next-line no-unused-vars
	const self = this;
	const { domainName = "" } = data;

	if (!domainName) {
		throw new Error("Domain name should not be empty");
	}
	if (domainName.toLowerCase() === "localhost") {
		throw new Error(
			"Domain name should not: localhost. Localhost is a reserved domain name",
		);
	}
	self.addToHostFile(domainName).then((addToDomainStaus) => {
		data.callback(addToDomainStaus);
	});
};

export const handleRemoveHostDomain = function (data) {
	// eslint-disable-next-line no-unused-vars
	const self = this;
	const { domainName = "" } = data;

	if (!domainName) {
		throw new Error("Domain name should not be empty");
	}
	if (domainName.toLowerCase() === "localhost") {
		throw new Error(
			"Domain name should not be: localhost. Localhost is a reserved domain name",
		);
	}
	self.removeFromHostFile(domainName).then((removeFromDomainStaus) => {
		data.callback(removeFromDomainStaus);
	});
};

export const addToHostFile = function (domainName) {
	const self = this;
	return new Promise((resolve, reject) => {
		let hostIpAddress = "127.0.0.1";
		let hostFileLocation = self.getHostFileLocation();
		let hostFileData = self.readFromHostFile(hostFileLocation);
		let newHostEntry = `${hostIpAddress} ${domainName}`; // eg: 127.0.0.1 example.com
		hostFileData += newHostEntry + "\n";
		console.log("NEW DATA", hostFileData);
		resolve(self.writeToHostFile(hostFileLocation, hostFileData));

		// async.waterfall([self.readHostsFile.bind(self)], (err, result) => {
		// 	console.log("THE WATERALL RESULTS", result);
		// 	resolve(result);
		// });
	});
};
export const removeFromHostFile = function () {
	const self = this;
	return new Promise((resolve, reject) => {
		let hostIpAddress = "127.0.0.1";
		let hostFileLocation = self.getHostFileLocation();
		let hostFileData = self.readFromHostFile(hostFileLocation);
	});
};
export const getHostFileLocation = function () {
	const self = this;
	const operatingSystem = self.getSystemType();
	let hostsFilePath = null;
	console.log("THE OPERATING SYSTEM", operatingSystem);

	switch (operatingSystem) {
		case "darwin":
			hostsFilePath = "/etc/hosts";
			break;
		default:
			hostsFilePath = "c:windowssystem32driversetchosts";
	}
	return hostsFilePath;
};
export const readFromHostFile = function (hostFileLocation) {
	const self = this;
	let data = fs.readFileSync(hostFileLocation, { encoding: "utf-8" });
	return data;
};
export const writeToHostFile = function (hostFileLocation, data) {
	const self = this;
	fs.writeFileSync(hostFileLocation, data);
	return { action: "successfull", message: "HostFile has been updated" };
};
