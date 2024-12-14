export const init = function () {
	this.adLog("Dman has been initialised");
	this.listens({
		"config-dman": this.handleConfigureDBMan.bind(this),
	});
	//   self.query('mysql',sql,process)
};
export const handleConfigureDBMan = function (data) {
	const self = this;
	const pao = self.pao;
	self.infoSync("The database credentials");
	self.infoSync(data);
	//   self.pao.pa_wiLog('THE DBMAN HANLDECONFIGURE')
	//   self.pao.pa_wiLog('THE SUPPORTED CLIENTS')
	//   self.pao.pa_wiLog(self.supportedClients)
	if (!pao.pa_isObject(data)) {
		self.logSync(
			`No database client specified,System will use default`,
			"warn",
		);
	} else {
		if (!pao.pa_contains(data, "clients")) {
			self.error(
				"System requires clients property with valid config to interface with database clients",
			);
		} else {
			// eslint-disable-next-line no-empty
			if (!pao.pa_isArray(data.clients)) {
			} else {
				let supported = self.supportedClients;
				try {
					// eslint-disable-next-line no-unused-vars
					data.clients.forEach((c, i) => {
						if (!pao.pa_contains(supported, c.name)) {
							self.throwError(
								`Client: "${c.name} is not supported by the system"`,
							);
						} else {
							self.pao.pa_wiLog(
								"THE SYSTEM IS ABOUT TO CONNECT TO THE THE SERVER",
							);
							self.connectToClient(c);
						}
					});
					if (self.DBS.length > 0) {
						self.adLog(`Sending databases to the dao`);
						self.emit({ type: "dao-take-dbs", data: { dbs: self.DBS } });
					}
					// eslint-disable-next-line no-empty
				} catch (e) {}
			}
		}
	}
};
export const connectToClient = function (client) {
	const self = this;
	self.infoSync(`System is about to connect to client: ${client.name}`);
	// self.infoSync(client)
	self.getClientDriver(client);
	// self.supportedClients[client.name].connect(client)
};
export const getClientDriver = function (client) {
	const self = this;
	self.pao.pa_wiLog(`System is getting a client driver`);
	self.pao.pa_wiLog("THE OTHER DETAILS BELOW");
	self.pao.pa_wiLog(client.name);
	self.pao.pa_wiLog(client.name === "mysql");
	try {
		let name = client.name;
		if (name === "mysql") {
			// self.supportedClients[client.name].driver = require("mysql2");
			self.supportedClients[client.name].driver = self.mysql2;
		}
		// }else if(name === 'pg'){
		// 	self.supportedClients[client.name].driver = require('pg')
		// }else if(name === 'redis'){
		// 	self.supportedClients[client.name].driver = require('redis')
		// }else if(name === 'mongo'){
		// 	self.supportedClients[client.name].driver = require('mongo')
		// }else{
		// 	self.supportedClients[client.name].driver = require('sqlite')
		// }
		// switch(client.name){
		// 	case 'mysql': self.supportedClients[client.name].driver = require('mysql')
		// 	break;
		// 	case 'pg': self.supportedClients[client.name].driver = require('pg')
		// 	break;
		// 	case 'redis': self.supportedClients[client.name].driver = require('redis')
		// 	break;
		// 	case 'mongo': self.supportedClients[client.name].driver = require('mongo')
		// 	break;
		// 	default: self.supportedClients[client.name].driver = require('sqlite')
		// 	break;
		// }
		if (!self.supportedClients[client.name].driver) {
			self.pao.pa_wiLog("THE DRIVER REQUIREMENT FAILED");
			self.throwError("Failed to get client driver module");
		}
		self.connect(client);
	} catch (e) {
		self.pao.pa_wiLog("THE DRIVER CONNECT ERROR");
		self.pao.pa_wiLog(e.stack);
	}
};
export const connect = function (client) {
	const self = this;
	self.infoSync(`System is connecting to client: ${client.name}`);
	self.infoSync(client.connect);
	try {
		let sclient = self.supportedClients[client.name];
		let opts = {
			host: client.connect.host,
			user: client.connect.user,
			password: client.connect.pass,
			database: client.connect.name,
		};
		//  self.infoSync('THE CLIENT DRIVER')
		//  self.infoSync(sclient)
		//  self.infoSync(sclient.driver)
		//  self.infoSync('THE CLIENT OPTIONS')
		//  self.infoSync(opts)
		let res = sclient.driver[sclient.connectMethod](opts, (err, res) => {
			if (err) {
				self.pao.pa_wiLog("THE ACTUAL CONNECTION ERROR");
				self.pao.pa_wiLog(err.stack);
			} else {
				self.DBS[client.name] = res;
				self.infoSync("System has successfully connected to client");
				self.infoSync(`Client ready to serve queries`);
			}
		});
		//   self.pao.pa_wiLog(res)
		// eslint-disable-next-line no-unused-vars
		res.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
			if (error) throw error;
			self.DBS[client.name] = res;
			self.infoSync(
				`System has successfully connected to ${client.name} database client`,
			);
			self.adLog("System is handing client connection");
			self.emit({
				type: "dao-take-dbs",
				data: { vendor: client.name, conn: res, connector: sclient.driver },
			});
			self.adLog(`Client ready to serve queries`);
			// console.log('The solution is: ', results[0].solution);
		});
		// res.query(function(e){
		// 	if(e){
		// 		self.pao.pa_wiLog('THE SYSTEM HAS FAILED TO CONNECT TO THE DATABASE, please refer to the error below:')
		// 		self.pao.pa_wiLog(e.message)
		// 		throw new Error(e)
		// 	}else{
		// 		self.DBS[client.name] = res
		// 		self.infoSync(`System has successfully connected to ${client.name} database client`)
		// 		self.adLog("System is handing client connection")
		// 		self.emit({type: 'dao-take-dbs',data:{vendor: client.name,conn: res}})
		// 		self.adLog(`Client ready to serve queries`)
		// 	}
		// })
		//   self.pao.pa_wiLog('THE RESULTS')
		//   res.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
		// 	if (error) throw error;
		// 	self.pao.pa_wiLog('THE CONNECTION TO THE DATABASE')
		// 	self.pao.pa_wiLog('The solution is: ', results[0].solution);
		//   });
		//   res.query()
	} catch (e) {
		self.infoSync("THE CONNECTION ERROR");
		self.infoSync(e.stack);
		self.pao.pa_wiLog("THE CONNECTION EROR");
		self.pao.pa_wiLog(e.stack);
	}
};
