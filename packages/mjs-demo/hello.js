class Hello {
	constructor(pao) {
		this.pao = pao;
	}
	init() {
		this.listens({
			"handle-hello-task": this.handleHelloTask.bind(this),
		});
	}
	handleHelloTask(data) {
		const self = this;
		self.logSync("THE DATA PASSED TO HELLO", data);
		self.callback = data.callback;
		let { payload } = data;
		let { user } = payload;
		let { name, surname } = user; // assume name to be "Ntsako" and surname to be "Mashele"
		let message = `Hello ${name} ${surname}, I'm happy to meet you.'`;
		self.logSync(payload.parsed.user);
		self
			.getSavedHistory()
			.then((saved) => {
				return self.callback(null, { message: message });
			})
			.catch((err) => {
				return self.callback(null, { message: message });
			});
		//return self.callback(null,{message: message})
	}
	getSavedHistory() {
		return new Promise((resolve, reject) => {
			const self = this;
			//let uid = pay.ID
			let queries = {
				returnFields: ["*"],
				tables: ["users"],
				conditions: [`id EQUALS 2`],
				//opiks: ['field.id.as[userID]']
			};
			self.query(
				"mysql.SEARCH",
				queries,
				self.multiDataRequestHandler.bind(this, resolve, reject),
			);
		});
	}
	multiDataRequestHandler(
		resolve = null,
		reject = null,
		e = null,
		result = null,
	) {
		const self = this;
		self.pao.pa_wiLog("THE TYPE OF E IN DATAREQUEST HANDLER");
		self.pao.pa_wiLog(e);
		if (e) reject(new Error("An error has occured Inside MYSQL"));
		resolve(result);
	}
}
export default Hello;
