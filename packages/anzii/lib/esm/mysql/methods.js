/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-mixed-spaces-and-tabs */
export const init = function () {
	this.adLog("Mysql has been initialised");
	this.listens({
		"mysql-data-request": this.handleMysqlDataRequest.bind(this),
	});
};
export const handleMysqlDataRequest = function (data) {
	const self = this;
	const pao = self.pao;
	// self.debug("Handling Mysql Data Request")
	// self.debug(data.table)
	// self.debug(data.outComehandler)
	// self.debug(data.opi)
	// self.debug(data)
	if (
		!pao.pa_contains(data, ["conn", "table", "opi", "query", "outComehandler"])
	) {
		self.debug("Data request operations failed");
		return data.outComehandler({ message: "Database operation failed" });
	} else {
		if (!pao.pa_isObject(data.conn)) {
			self.debug("THE connection is not object");
		} else {
			if (!pao.pa_isString(data.table)) {
				self.debug("THE TABLE NAME IS NOT A STRING");
			} else {
				if (data.opi.trim() !== "deletemultiple" && !self[data.opi]) {
					self.debug("DATA.OPI IS NOT CONTAINED AS FUNCTION");
					self.debug(data.opi.trim() !== "deletemultiple");
					self.debug(data.opi);
					return data.outComehandler({
						message: "The specified operation is not supported",
					});
				} else {
					self.debug("THE CODE GOES THIS FAR");
					if (data.opi === "insert") {
						data.opi = "insertOne";
						self[data.opi](data);
						self.debug("this runs after opi finishes");
					} else if (data.opi === "find") {
						// data.opi = 'findOne'
						self[data.opi](data);
					} else if (data.opi === "updateOne") {
						data.opi = "updateOne";
						self[data.opi](data);
					} else if (data.opi === "transaction") {
						data.opi = "transaction";
						self[data.opi](data);
					} else if (data.opi === "procedure") {
						data.opi = "procedure";
						self[data.opi](data);
					} else if (data.opi === "join") {
						data.opi = "join";
						self[data.opi](data);
					} else if (data.opi === "search") {
						data.opi = "search";
						self[data.opi](data);
					} else if (data.opi === "remove") {
						data.opi = "remove";
						self[data.opi](data);
					} else if (data.opi === "updateandtake") {
						self[data.opi](data);
					} else if (data.opi === "insertandtake") {
						self[data.opi](data);
					} else if (data.opi === "deleteandtake") {
						self[data.opi](data);
					} else if (data.opi === "deletemultiple") {
						self.deleteandtake(data);
					} else {
						self[data.opi](data);
					}
				}
			}
		}
	}
};
export const insertOne = function (insert) {
	const self = this;
	const pao = self.pao;
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(insert)) {
	} else {
		try {
			// self.infoSync('THE INSERT INSERT ONE')
			// self.infoSync(insert)
			let handler = insert.outComehandler;
			const conn = insert.conn;
			const connector = insert.connector;
			const query = insert.query;
			self.debug("THE INSERT OBJECT");
			self.debug(insert);
			let sql = `INSERT INTO ?? (??) VALUES(?)`;
			let queryAttributes = [
				insert.table,
				["id", ...query.fields],
				[null, ...query.values],
			];
			sql = connector.format(sql, queryAttributes);
			self.debug("THE SQL STATEMENT");
			self.debug(sql);
			self.infoSync("THE HANDLER");
			self.infoSync(handler);
			//  let sql = `INSERT INTO ${data.table} SET ?`
			conn.query(sql, function (e, r) {
				self.debug("INSERT RESULT");
				self.debug(r);
				self.debug(e);
				if (e) return handler(e, null);
				r.user = insert.values;
				self.debug(r.user);
				self.info("THE HANDLER IN QUERY");
				self.infoSync(handler);
				handler(null, r);
			});
		} catch (e) {
			self.debug("CAUTH ERROR");
			self.debug(e);
			self.infoSync("THE CAUTH ERROR");
			self.infoSync(e);
			// eslint-disable-next-line no-undef
			handler(e, null);
		}
	}
};
export const insertMany = function (insert) {
	const self = this;
	const pao = self.pao;
	// eslint-disable-next-line no-undef, no-empty
	if (!pao.pa_isObject(data)) {
	} else {
		try {
			let sql = `INSERT INTO ?? (?) VALUES(?)`;
			let result = [];
			// eslint-disable-next-line no-unused-vars
			let fullImplement = true;
			insert.bulk.forEach((insertItem) => {
				let queryAttributes = [
					insertItem.table,
					[...insertItem.fields],
					[...insertItem.values],
				];
				// eslint-disable-next-line no-undef
				sql = connector.format(sql, queryAttributes);
				// eslint-disable-next-line no-undef
				conn.query(sql, insertItem, function (e, r) {
					if (e) {
						fullImplement = false;
					} else {
						result.push(r);
					}
				});
			});
			self.debug("bulk insert completed");
			// eslint-disable-next-line no-undef
			handler(null, result);
		} catch (e) {
			// eslint-disable-next-line no-undef
			handler(e, null);
		}
	}
};
export const find = async function (findiks) {
	const self = this;
	const pao = self.pao;
	// self.infoSync('THE FINDIKS')
	// self.infoSync(findiks)
	// self.debug('fIND.FINDIKS')
	// self.debug(findiks.query.length)
	// if(findiks.query.length > 0){ return findiks.outComehandler({message: 'ERROR IN MYSQL.FIND.METHOD'})}
	// self.debug('THE DATA IN FINDONE')
	// self.debug(findiks)
	if (!pao.pa_isObject(findiks)) {
		throw new Error("Argument:: findiks, is required");
	} else {
		let conn = findiks.conn;
		let connector = findiks.connector;
		let handler = findiks.outComehandler;
		let query = [];
		let result = [];
		// self.infoSync('THE FUNCTIONS')
		// self.infoSync(connector.format)
		// self.infoSync(conn.query)
		conn.getConnection(async function (err, connection) {
			if (err)
				throw new Error("THERE WAS AN ERROR GETTING CONNECTION FROM THE POOL");
			let multiple = false;
			if (findiks.table.toUpperCase().trim() === "MULTIPLE") {
				self.infoSync("IT IS MULTIPLE");
				self.infoSync(findiks.query);
				multiple = true;
				query = findiks.query;
			} else {
				self.infoSync("THE QURY");
				self.infoSync(query);
				query.push(findiks.query);
			}
			for (let q = 0; q < query.length; q++) {
				// self.infoSync('INDEX')
				// self.infoSync(q)
				// self.infoSync('THE RESULT VALUE')
				// self.infoSync(result)
				let find = null;
				if (multiple) {
					find = { table: query[q].table, ...query[q] };
				} else {
					find = { table: findiks.table, ...query[q] };
					// find.opiks && Object.keys(find).length === 2 ? '' : !find.conditions ? find.conditions = [`${Object.keys(query)[0]} ISEQUALS ${query[Object.keys(query)[0]]}`]: ''
				}
				try {
					// self.infoSync('THE FIND')
					// self.infoSync(find)
					self.infoSync("THE CURRENT INDEX");
					self.infoSync(q);
					let sql = "";
					let attribs = null;
					let sqliks = self.queryTemplate(self.queryOptions(find), "select");
					//  self.debug('THE SQLKIKS OBJECT FIND')
					//  self.debug(sqliks)
					attribs = [sqliks.attribs.from.table];
					sql = sqliks.statement;
					let queryAttributes = attribs;
					// self.debug('THE SQL BEFORE FORMAT')
					sql = connector.format(sql, queryAttributes);
					// self.debug(sql)
					// self.debug(sql)
					self.infoSync("THE SQL AFTER FORMATTING");
					self.infoSync(sql);
					// self.infoSync('CHECK IF CONN.QUERY IS A PROMISE')
					// self.infoSync(conn.query)
					// self.infoSync(conn.query.then ? 'It is promise' : 'it is not a promise')
					let currentResult = await self.findIterateItemPromise(
						connection,
						sql,
					);
					let isError = currentResult instanceof Array ? false : true;
					self.infoSync("THE RESULT");
					self.infoSync(currentResult);
					self.infoSync(currentResult.length);
					self.infoSync(isError);
					self.infoSync(currentResult.length === 0 && query.length === 1);
					if (isError) {
						if (find.alias) {
							if (result instanceof Array) {
								result = { [find.alias]: { ERROR: currentResult.e } };
							} else {
								result[find.alias] = { ERROR: currentResult.e };
							}
						} else {
							result.push({ ERROR: currentResult.e });
						}
					} else if (currentResult.length === 0 && query.length === 1) {
						self.infoSync(
							"cURRENT RESULT IS EMPTY AND THE IS ONLY ONE QUERY BEING PROCESSED",
						);
						self.infoSync(currentResult);
						connection.release();
						findiks.select
							? handler(null, [], findiks.select)
							: handler(null, []);
						return;
					} else {
						if (find.alias) {
							if (result instanceof Array) {
								result = { [find.alias]: currentResult };
							} else {
								result[find.alias] = currentResult;
							}
						} else {
							result.push(currentResult);
						}
					}
					if (q === query.length - 1) {
						self.infoSync("WE ARE RELEASING THE CONNECTION");
						connection.release();
						if (result.length === 1 && result[0] instanceof Array)
							result = result[0];
						findiks.select
							? handler(null, result, findiks.select)
							: handler(null, result);
						return;
					}
					// self.infoSync('THE QUERYRESULT')
					// self.infoSync(queryRes)
					// conn.query(sql,function(e,r,f){
					//       // self.debug('THE QUERY IS COMPLETED WITH RESULTS')
					//       // self.debug(e)
					//       // self.debug(r)
					//       // self.debug(typeof r)
					//       // self.debug(f)
					//       // self.debug(r instanceof Array)
					//       // self.debug(pao.pa_isArray(r))
					//       // self.debug(r.length)
					//       // self.debug('After R evaluation')
					//       // self.infoSync('THE rESULT HAS BEEN RETRIEVED')
					//       // self.infoSync(r)
					//       // self.infoSync(result)
					//       // self.infoSync(pao.pa_isArray(r))
					//       // self.infoSync(r.length)
					//       // self.infoSync(query.length)
					//       // self.infoSync(e)
					//       try{
					//       if(e) result.push(e)
					//       if(pao.pa_isArray(r) && r.length > 0 && query.length !== 1 ){
					//           if(find.alias){
					//             if(result instanceof Array){
					//               self.infoSync('THE RESULT TO BE CONVERTED TO OBJECT')
					//               self.infoSync(find.alias)
					//               result = {[find.alias]: [...r]}
					//               self.infoSync(result)
					//             }else{
					//               self.infoSync('THE RESULT OBJECT IS TYPE OBJECT')
					//               self.infoSync(result)
					//               result[find.alias] = [...r]
					//             }
					//           }else{
					//             r = [...r];
					//             result.push(r)
					//           }
					//         }else{
					//           // self.infoSync('the result is not an array')
					//           // self.infoSync(r)
					//           // if(result.length > 0){
					//           //   self.infoSync('THE RESULT IS GREATER THAN ZERO')
					//           // }else{
					//           // }
					//           result = r
					//         }
					//       if(q === query.length - 1){
					//         self.debug('THE LOOP IS COMPLETE WITH DATA:')
					//         self.debug(result)
					//         self.infoSync('THE CURRENT LAST RESULT')
					//          self.infoSync(q)
					//          self.infoSync(r)
					//         self.infoSync('THE LOOP IS COMPLETE WITH RESULTS')
					//         self.infoSync(result)
					//         findiks.select ?  handler(null,result,findiks.select) : handler(null,result)
					//         return
					//       }else{
					//          self.infoSync('THE CURRENT RESULT')
					//          self.infoSync(q)
					//          self.infoSync(r)
					//       }
					//     }catch(erra){
					//       self.infoSync('ther erra')
					//       self.infoSync(erra)
					//     }
					//   })
				} catch (e) {
					// self.debug('AN ERROR OCCURED IN FIND ONE ')
					// self.debug(e)
					findiks.select ? handler(e, null, findiks.select) : handler(e, null);
					return;
				}
			}
		});
	}
};
export const findOne = async function (findiks) {
	const self = this;
	const pao = self.pao;
	// self.infoSync('THE FINDIKS')
	// self.infoSync(findiks)
	// self.debug('fIND.FINDIKS')
	// self.debug(findiks.query.length)
	// if(findiks.query.length > 0){ return findiks.outComehandler({message: 'ERROR IN MYSQL.FIND.METHOD'})}
	// self.debug('THE DATA IN FINDONE')
	// self.debug(findiks)
	if (!pao.pa_isObject(findiks)) {
		throw new Error("Argument:: findiks, is required");
	} else {
		let conn = findiks.conn;
		let connector = findiks.connector;
		let handler = findiks.outComehandler;
		let query = [];
		let result = [];
		let multiple = false;
		if (findiks.table.toUpperCase().trim() === "MULTIPLE") {
			self.infoSync("IT IS MULTIPLE");
			self.infoSync(findiks.query);
			multiple = true;
			query = findiks.query;
		} else {
			self.infoSync("THE QURY");
			self.infoSync(query);
			query.push(findiks.query);
		}
		for (let q = 0; q < query.length; q++) {
			// self.infoSync('INDEX')
			// self.infoSync(q)
			// self.infoSync('THE RESULT VALUE')
			// self.infoSync(result)
			let find = null;
			if (multiple) {
				find = { table: query[q].table, ...query[q] };
			} else {
				find = { table: findiks.table, ...query[q] };
				// find.opiks && Object.keys(find).length === 2 ? '' : !find.conditions ? find.conditions = [`${Object.keys(query)[0]} ISEQUALS ${query[Object.keys(query)[0]]}`]: ''
			}
			try {
				// self.infoSync('THE FIND')
				// self.infoSync(find)
				self.infoSync("THE CURRENT INDEX");
				self.infoSync(q);
				let sql = "";
				let attribs = null;
				let sqliks = self.queryTemplate(self.queryOptions(find), "select");
				//  self.debug('THE SQLKIKS OBJECT FIND')
				//  self.debug(sqliks)
				attribs = [sqliks.attribs.from.table];
				sql = sqliks.statement;
				let queryAttributes = attribs;
				// self.debug('THE SQL BEFORE FORMAT')
				sql = connector.format(sql, queryAttributes);
				// self.debug(sql)
				// self.debug(sql)
				self.infoSync("THE SQL AFTER FORMATTING");
				self.infoSync(sql);
				// self.infoSync('CHECK IF CONN.QUERY IS A PROMISE')
				// self.infoSync(conn.query)
				// self.infoSync(conn.query.then ? 'It is promise' : 'it is not a promise')
				let currentResult = await self.findIterateItemPromise(conn, sql);
				let isError = currentResult instanceof Array ? false : true;
				self.infoSync("THE RESULT");
				self.infoSync(currentResult);
				self.infoSync(currentResult.length);
				self.infoSync(isError);
				self.infoSync(currentResult.length === 0 && query.length === 1);
				if (isError) {
					if (find.alias) {
						if (result instanceof Array) {
							result = { [find.alias]: { ERROR: currentResult.e } };
						} else {
							result[find.alias] = { ERROR: currentResult.e };
						}
					} else {
						result.push({ ERROR: currentResult.e });
					}
				} else if (currentResult.length === 0 && query.length === 1) {
					self.infoSync(
						"cURRENT RESULT IS EMPTY AND THE IS ONLY ONE QUERY BEING PROCESSED",
					);
					self.infoSync(currentResult);
					// eslint-disable-next-line no-undef
					connection.release();
					findiks.select
						? handler(null, [], findiks.select)
						: handler(null, []);
					return;
				} else {
					if (find.alias) {
						if (result instanceof Array) {
							result = { [find.alias]: currentResult };
						} else {
							result[find.alias] = currentResult;
						}
					} else {
						result.push(currentResult);
					}
				}
				if (q === query.length - 1) {
					if (result.length === 1 && result[0] instanceof Array)
						result = result[0];
					findiks.select
						? handler(null, result, findiks.select)
						: handler(null, result);
					return;
				}
			} catch (e) {
				// self.debug('AN ERROR OCCURED IN FIND ONE ')
				// self.debug(e)
				// eslint-disable-next-line no-undef
				connection.release();
				findiks.select ? handler(e, null, findiks.select) : handler(e, null);
				return;
			}
		}
	}
};
export const findIterateItemPromise = function (conn, sql) {
	const self = this;
	return new Promise((resolve, reject) => {
		conn.query(sql, function (e, r) {
			self.infoSync("fINDITERATE ERROR");
			self.infoSync(e);
			self.infoSync(r);
			if (e) return reject({ FIND_ITERATE_ERROR: true, e: e });
			return resolve(r);
			// if(pao.pa_isArray(r) && r.length > 0 && query.length !== 1 ){
			//     if(find.alias){
			//       if(result instanceof Array){
			//         self.infoSync('THE RESULT TO BE CONVERTED TO OBJECT')
			//         self.infoSync(find.alias)
			//         result = {[find.alias]: [...r]}
			//         self.infoSync(result)
			//       }else{
			//         self.infoSync('THE RESULT OBJECT IS TYPE OBJECT')
			//         self.infoSync(result)
			//         result[find.alias] = [...r]
			//       }
			//     }else{
			//       r = [...r];
			//       result.push(r)
			//     }
			//   }else{
			//     result = r
			//   }
		});
	});
};
export const updateOne = function (updatiks) {
	const self = this;
	self.debug("THE UPDATIKS");
	self.debug(updatiks);
	self.infoSync("THE UPDATIKS");
	self.infoSync(updatiks.update);
	const pao = self.pao;
	let conn = updatiks.conn;
	let connector = updatiks.connector;
	let handler = updatiks.outComehandler;
	let update = { table: updatiks.table, ...updatiks.query };
	//self.debug(update)
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(updatiks)) {
	} else {
		try {
			let sql = "";
			let attribs = null;
			let sqliks = self.queryTemplate(self.queryOptions(update), "update");
			self.debug("THE SQLKIKS OBJECT UPDATE");
			self.debug(sqliks);
			attribs = [sqliks.attribs.from.table];
			sql = sqliks.statement;
			let queryAttributes = attribs;
			self.debug("THE SQL BEFORE FORMAT");
			self.debug(sql);
			// self.infoSync('THE CONNECTION METHODS')
			// self.infoSync(conn)
			sql = connector.format(sql, queryAttributes);
			self.debug(sql);
			self.infoSync("THE UPDATE SQL");
			self.infoSync(sql);
			conn.query(sql, function (e, r) {
				if (e) handler(e, null);
				updatiks.update ? handler(null, r, updatiks.update) : handler(null, r);
			});
		} catch (e) {
			handler(e, null);
		}
	}
};
export const updateMany = function (update) {
	const self = this;
	const pao = self.pao;
	// eslint-disable-next-line no-empty, no-undef
	if (!pao.pa_isObject(data)) {
	} else {
		try {
			let sql = `UPDATE TABLE ?? SET ?? WHERE ??`;
			let result = [];
			// eslint-disable-next-line no-unused-vars
			let fullImplement = true;
			update.bulk.forEach((updateItem) => {
				let queryAttributes = [
					update.table,
					[...update.fields],
					update.condition,
				];
				// eslint-disable-next-line no-undef
				sql = connector.format(sql, queryAttributes);
				// eslint-disable-next-line no-undef
				conn.query(sql, updateItem, function (e, r) {
					if (e) {
						fullImplement = false;
					} else {
						result.push(r);
					}
				});
			});
			self.debug("bulk update completed");
			// eslint-disable-next-line no-undef
			handler(null, result);
		} catch (e) {
			// eslint-disable-next-line no-undef
			handler(e, null);
		}
	}
};
export const updateandtake = async function (updateAndTake) {
	const self = this;
	self.debug("THE UPDATIKANDTAKE");
	self.debug(updateAndTake);
	const pao = self.pao;
	let conn = updateAndTake.conn;
	let connector = updateAndTake.connector;
	let handler = updateAndTake.outComehandler;
	let updateTake = updateAndTake.query;
	//self.debug(update)
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(updateAndTake)) {
	} else {
		try {
			let options = await self.searchOptions(updateTake, true);
			self
				.multiTableUpdate(options, conn, connector)
				.then((updated) => {
					if (updated.changedRows > 0) {
						self
							.take(options, conn, updateTake.conditions, connector)
							.then((taken) => {
								// updated.changedRows > 0 ? handler(null,{updated: true,taken: taken}) : ''
								handler(null, { updated: true, taken: taken });
							})
							.catch((e) => {
								handler(e, null);
							});
					} else {
						// handler({updated: false,taken: taken})
						self.debug("NO CHANGED ROWS IN A MULTIPLE UPDATE");
						self.debug(options);
						self
							.take(options, conn, updateTake.conditions, connector)
							.then((taken) => {
								handler(null, { updated: false, taken: taken });
							})
							.catch((e) => {
								handler(e, null);
							});
						//
						// {
						//   tables:['jo_user','jo_pao.pa_wiLogin'],
						//   joins: 2,
						//   joinPoints: ['jo_user.id EQUALS jo_pao.pa_wiLogin.id'],
						//   conditions: [`jo_user.id EQUALS 1`,`AND jo_pao.pa_wiLogin.u_id EQUALS 1`],
						//   opiks: ['field.first_name.as[firstName]','field.last_name.as[lastName]',
						//   set: [{first_name: 'Surprise',last_name: 'Mashele'},{password: '1234567'}],
						//   takeFrom: 'jo_user'
						//  }
					}
				})
				.catch((e) => {
					handler(e, null);
				});
		} catch (e) {
			handler(e, null);
		}
	}
};
export const insertandtake = async function (insertAndTake) {
	const self = this;
	self.debug("THE INSERTANDTAKE");
	self.debug(insertAndTake);
	// self.infoSync('THe insertAnd Take')
	// self.infoSync(insertAndTake)
	const pao = self.pao;
	let conn = insertAndTake.conn;
	let handler = insertAndTake.outComehandler;
	let insert = insertAndTake.query.insert;
	let takeQuery = insertAndTake.query.take;
	let connector = insertAndTake.connector;
	//self.debug(update)
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(insertAndTake)) {
	} else {
		try {
			let insertTakeHandle = async function (error = null, inserted = null) {
				await self.debug("THE INSERTED RECORD UPDATE");
				await self.debug(error);
				await self.debug(inserted);
				await self.debug(self.SEARCH);
				!takeQuery.conditions
					? (takeQuery.conditions = [`id ISEQUAL ${inserted.insertId}`])
					: "";
				await self.debug(takeQuery);
				let take = {};
				take.conn = conn;
				take.query = takeQuery;
				take.connector = connector;
				// eslint-disable-next-line no-unused-vars
				take.outComehandler = (e = null, taken) => {
					handler(null, { inserted: inserted, taken: taken });
				};
				self.infoSync("INSERTANDTAKE TAKING");
				self.infoSync(take);
				self.search(take);
				// throw new Error('MADE UP ERROR')
				//  self.SEARCH(take)
			};
			insert.outComehandler = insertTakeHandle.bind(self);
			insert.conn = conn;
			insert.connector = connector;
			insert.query = {
				fields: [...insert.fields],
				values: [...insert.values],
			};
			self.insertOne(insert);
		} catch (e) {
			handler(e, null);
		}
	}
};
export const deleteandtake = async function (deleteAndTake) {
	const self = this;
	self.debug("THE DELETEANDTAKE");
	self.debug(deleteAndTake);
	const pao = self.pao;
	let conn = deleteAndTake.conn;
	let handler = deleteAndTake.outComehandler;
	let connector = deleteAndTake.connector;
	let remove = null;
	let takeQuery = null;
	if (deleteAndTake.query.remove) {
		remove = deleteAndTake.query.remove;
		takeQuery = deleteAndTake.query.take;
	}
	//self.debug(update)
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(deleteAndTake)) {
	} else {
		try {
			let deleteTakeHandle = async function (error = null, deleted = null) {
				await self.debug("THE deleted RECORD UPDATE");
				await self.debug(error);
				await self.debug(deleted);
				if (!takeQuery) {
					handler(null, { deleted: deleted });
				} else {
					!takeQuery.conditions
						? (takeQuery.conditions = remove.conditions)
						: "";
					await self.debug(takeQuery);
					let take = {};
					take.conn = conn;
					take.connector = connector;
					take.query = takeQuery;
					// eslint-disable-next-line no-unused-vars
					take.outComehandler = (e = null, taken) => {
						self.debug("DELETED AND TAKEN OPERATION");
						self.debug(deleted);
						self.debug(taken);
						handler(null, { deleted: deleted, taken: taken });
					};
					self.search(take);
				}
				// throw new Error('MADE UP ERROR')
				//  self.SEARCH(take)
			};
			if (!remove) remove = deleteAndTake.query;
			remove.outComehandler = deleteTakeHandle.bind(self);
			remove.conn = conn;
			remove.connector = connector;
			self.removeJoin(remove);
		} catch (e) {
			handler(e, null);
		}
	}
};
export const updateJoinTemplate = function (options) {
	// `UPDATE ??
	// SET ${options.set}
	// WHERE ${options.from.condition}
	// `
	const self = this;
	self.debug("UPDATE OPTIONS");
	self.debug(options);
	let sqlAttribs = {};
	sqlAttribs.attribs = { from: options.from, tables: options.tables };
	switch (options.length) {
		case 2:
			sqlAttribs.statement = `UPDATE ??
                            JOIN ${options.tables[0]}
                              ON ${options.joinPoints[0]}
                            SET ${options.set}
                            WHERE ${options.from.condition}
                            `;
			break;
		case 3:
			sqlAttribs.statement = `UPDATE ??,??,??
                              JOIN ${options.tables[0]}
                                ON ${options.conditions[0]}
                              JOIN ${options.tables[1]}
                                ON ${options.conditions[1]}
                              SET ${options.set}
                              WHERE ${options.from.condition}
                              
                              `;
			break;
		case 4:
			sqlAttribs.statement = `UPDATE ??,??,??,??
                            JOIN ${options.tables[0]}
                              ON ${options.conditions[0]}
                            JOIN ${options.tables[1]}
                              ON ${options.conditions[1]}
                            JOIN ${options.tables[2]}
                            ON ${options.conditions[2]}
                            SET ${options.set}
                            WHERE ${options.from.condition}
                            
                            `;
			break;
		default:
			sqlAttribs.statement = `UPDATE ??
                            SET ${options.set}
                            WHERE ${options.from.condition}
                            
                            `;
	}
	return sqlAttribs;
};
export const multiTableUpdate = async function (options, conn, connector) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	return new Promise((resolve, reject) => {
		try {
			// self.debug('THE SQLKIKS OBJECT UPDATE')
			// self.debug(sqliks)
			// attribs = [sqliks.attribs.from.table]
			let sql = "";
			let attribs = null;
			let sqliks = self.updateJoinTemplate(options);
			self.debug("THE SQLKIKS OBJECT");
			self.debug(sqliks);
			contains(sqliks.attribs, "tables") && sqliks.attribs.tables
				? (attribs = [sqliks.attribs.from.table, ...sqliks.attribs.tables])
				: (attribs = [sqliks.attribs.from.table]);
			sql = sqliks.statement;
			let queryAttributes = attribs;
			self.debug("THE SQL BEFORE FORMAT::MULTIUPDATE");
			self.debug(sql);
			sql = connector.format(sql, queryAttributes);
			self.debug(sql);
			conn.query(sql, function (e, r) {
				if (e) return reject(e);
				resolve(r);
			});
		} catch (e) {
			reject(e);
		}
	});
};
export const take = async function (options, conn, conditions, connector) {
	const self = this;
	self.debug("TAKE:::");
	self.debug(options);
	return new Promise((resolve, reject) => {
		if (options.takeFrom) {
			let takeFrom = options.takeFrom;
			self.debug("THE TAKEFROM BY TAKEFROM");
			self.debug(takeFrom);
			if (takeFrom.condition) {
				self.debug("THE TAKEFROM CONDITIION IS SET");
				options.from.condition = takeFrom.condition;
				takeFrom.tables.length > 1
					? (options.length = takeFrom.tables.length)
					: "";
				options.length
					? takeFrom.joinPoints
						? (options.joinPoints = takeFrom.joinPoints)
						: ""
					: "";
				self
					.takeSql(options, conn, connector)
					.then((resultset) => {
						resolve(resultset);
					})
					.catch((e) => {
						reject(e);
					});
			} else {
				self.debug("THE TAKEFROM HAS NO SET CONDITIONS");
				self.debug(options);
				delete options.length;
				options.from.condition = self.searchConditionsFormat([conditions[0]]);
				// options.tables = options.tables[0]
				self
					.takeSql(options, conn, connector)
					.then((resultset) => {
						resolve(resultset);
					})
					.catch((e) => {
						reject(e);
					});
			}
		} else {
			self.debug("THE TAKEFROM IS NOT DEFINED");
			self
				.takeSql(options, conn, connector)
				.then((resultset) => {
					resolve(resultset);
				})
				.catch((e) => {
					reject(e);
				});
		}
	});
};
export const takeSql = function (takeOptions, conn, connector) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	self.debug("THE SEARCH");
	self.debug(search);
	return new Promise(function (resolve, reject) {
		// do a thing, possibly async, then…
		self.debug("Executing the search promise");
		let sql = "";
		let attribs = null;
		let sqliks = self.searchStatement(takeOptions);
		self.debug("THE SQLKIKS OBJECT");
		self.debug(sqliks);
		contains(sqliks.attribs, "tables")
			? (attribs = [sqliks.attribs.from.table, ...sqliks.attribs.tables])
			: (attribs = [sqliks.attribs.from.table]);
		sql = sqliks.statement;
		let queryAttributes = attribs;
		self.debug("THE SQL BEFORE FORMAT::");
		self.debug(sql);
		// self.debug(conn)
		sql = connector.format(sql, queryAttributes);
		self.debug(sql);
		conn.query(sql, function (e, r) {
			if (e) {
				self.debug("Promise is rejecting search");
				self.debug(e);
				reject(e);
			} else {
				self.debug("Promise is Resolving search");
				self.debug(r);
				self.debug(r[0]);
				resolve(r);
			}
		});
	});
};
export const removeJoin = function (removiks) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	let conn = removiks.conn;
	let connector = removiks.connector;
	let handler = removiks.outComehandler;
	// let remove = {table: removiks.table,...removiks.query}
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(removiks)) {
	} else {
		try {
			let sql = "";
			let attribs = null;
			let sqliks = self.queryTemplate(self.searchOptions(removiks), "delete");
			self.debug("THE SQLKIKS OBJECT DELETEDANDTAKE[REMOVE]");
			self.debug(sqliks);
			contains(sqliks.attribs, "tables")
				? (attribs = [...sqliks.attribs.tables, sqliks.attribs.from.table])
				: (attribs = [sqliks.attribs.from.table]);
			sql = sqliks.statement;
			let queryAttributes = attribs;
			self.debug("THE SQL BEFORE FORMAT");
			self.debug(sql);
			sql = connector.format(sql, queryAttributes);
			self.debug(sql);
			conn.query(sql, function (e, r) {
				if (e) return handler(e, null);
				handler(null, r);
			});
		} catch (e) {
			handler(e, null);
		}
	}
};
export const remove = function (removiks) {
	const self = this;
	const pao = self.pao;
	let conn = removiks.conn;
	let connector = removiks.connector;
	let handler = removiks.outComehandler;
	let remove = { table: removiks.table, ...removiks.query };
	// eslint-disable-next-line no-empty
	if (!pao.pa_isObject(removiks)) {
	} else {
		try {
			let sql = "";
			let attribs = null;
			let sqliks = self.queryTemplate(self.queryOptions(remove), "delete");
			self.debug("THE SQLKIKS OBJECT DELETED[REMOVE]");
			self.debug(sqliks);
			attribs = [sqliks.attribs.from.table];
			sql = sqliks.statement;
			let queryAttributes = attribs;
			self.debug("THE SQL BEFORE FORMAT");
			self.debug(sql);
			sql = connector.format(sql, queryAttributes);
			self.debug(sql);
			conn.query(sql, function (e, r) {
				if (e) handler(e, null);
				return removiks.delete
					? handler(null, r, removiks.delete)
					: handler(null, r);
				// handler(null,r)
			});
		} catch (e) {
			handler(e, null);
		}
	}
};
export const queryOptions = function (i) {
	const self = this;
	self.debug("THE search BATCH ITEM");
	self.debug(i);
	let pao = self.pao;
	let contains = pao.pa_contains;
	// let rest = {
	// 	conditions: [`country_id EQUALS 202`],
	// 	opiks: ['field.id.as[stateId]','field.state_name.as[state]','field.country_id.as[countryId]'],
	// 	sort: 'order[state_name].asc',
	// 	range: '2,5',
	// 	take: 5
	//   }
	let options = {};
	i.conditions
		? (options.from = {
				table: i.table,
				condition: self.searchConditionsFormat(i.conditions),
		  })
		: (options.from = { table: i.table });
	self.debug("THE CODE GETS HERE");
	self.debug(options);
	contains(i, ["returnFields", "opiks"])
		? (options.fields = self.searchFieldsFormat(i.opiks, i.returnFields))
		: contains(i, "opiks")
		? (options.fields = self.searchFieldsFormat(i.opiks))
		: contains(i, "returnFields")
		? i.returnFields.length === 1 && i.returnFields[0].trim() === "all"
			? (options.fields = "*")
			: (options.fields = i.returnFields)
		: (options.fields = "*");
	contains(i, "take") ? (options.take = i.take) : "";
	contains(i, "range") ? (options.range = i.range) : "";
	contains(i, "sort") ? (options.sort = i.sort) : "";
	contains(i, "set") ? (options.set = self.set(i.set)) : "";
	contains(i, "takeFrom")
		? i.takeFrom.conditions
			? ((options.takeFrom = i.takeFrom),
			  (options.takeFrom.condition = self.searchConditionsFormat(
					i.takeFrom.conditions,
			  )))
			: (options.takeFrom = i.takeFrom)
		: "";
	self.debug("THE OPTIONS");
	self.debug(options);
	return options;
};
export const queryTemplate = function (options, type) {
	const self = this;
	const pao = self.pao;
	const contains = pao.pa_contains;
	self.debug("THE QUERY TEMPLATE");
	self.debug(options);
	if (type === "select") {
		let sqlAttribs = {};
		sqlAttribs.attribs = { from: options.from };
		let limit = " ";
		let sort = options.sort ? self.sort(options.sort) : " ";
		options.take
			? (limit = self.limit(options.take, "take"))
			: options.range
			? (limit = self.limit(options.range, "range"))
			: " ";
		if (contains(options.from, "condition")) {
			sqlAttribs.statement = `SELECT ${options.fields}
                              FROM  ??
                              WHERE ${options.from.condition}
                              ${sort}
                              ${limit}

                              `;
		} else {
			sqlAttribs.statement = `SELECT ${options.fields}
                              FROM  ??
                              ${sort}
                              ${limit}
                              `;
		}
		return sqlAttribs;
	} else if (type === "update") {
		let sqlAttribs = {};
		sqlAttribs.attribs = { from: options.from };
		sqlAttribs.statement = `UPDATE ??
                            SET ${options.set}
                            WHERE ${options.from.condition}
                            `;
		return sqlAttribs;
	} else if (type === "delete") {
		if (options.length) {
			let sqlAttribs = {};
			sqlAttribs.attribs = { from: options.from, tables: options.tables };
			options.tables.unshift(options.from.table);
			self.debug("DELETE OPTIONS OBJECT");
			self.debug(options);
			self.debug(options.tables);
			self.debug(options.length);
			switch (options.length) {
				case 3:
					sqlAttribs.statement = `DELETE ??,??,??
                                  FROM ??
                                  JOIN ${options.tables[1]}
                                    ON ${options.joinPoints[0]}
                                  JOIN ${options.tables[2]}
                                    ON ${options.joinPoints[1]}
                                  WHERE ${options.from.condition}
                                  
                                  `;
					break;
				case 4:
					sqlAttribs.statement = `DELETE ??,??,??,??
                                FROM ??
                                JOIN ${options.tables[1]}
                                  ON ${options.joinPoints[0]}
                                JOIN ${options.tables[2]}
                                  ON ${options.joinPoints[1]}
                                JOIN ${options.tables[3]}
                                ON ${options.joinPoints[3]}
                                WHERE ${options.from.condition}
                                
                                `;
					break;
				default:
					sqlAttribs.statement = `DELETE ??,??
                                  FROM ??
                                  JOIN ${options.tables[1]}
                                    ON ${options.joinPoints[0]}
                                  WHERE ${options.from.condition}
                                  
                                  `;
			}
			self.debug("SQL ATTRRIBS");
			self.debug(sqlAttribs);
			return sqlAttribs;
		} else {
			let sqlAttribs = {};
			sqlAttribs.attribs = { from: options.from };
			sqlAttribs.statement = `DELETE
                                FROM ??
                                `;
			options.from.condition
				? (sqlAttribs.statement += ` WHERE ${options.from.condition}`)
				: "";
			return sqlAttribs;
		}
	}
};
export const transaction = function (data) {
	const self = this;
	if (typeof data.query === "function") {
		data.query();
	} else {
		self.TRANSACTION(
			data.query,
			data.conn,
			data.outComehandler,
			data.connector,
		);
	}
};
export const procedure = function (data) {
	const self = this;
	self.debug("THE procedure got a call");
	if (typeof data.query === "function") {
		data.query();
	} else {
		self.debug("INSIDE PROCEDURE");
		//  self.debug(data.outComehandler)
		//  self.debug(data)
		self.PROCEDURE(data.query, data.conn, data.outComehandler, data.connector);
	}
};
export const join = function (data) {
	const self = this;
	self.debug("THE procedure got a call");
	if (typeof data.query === "function") {
		data.query();
	} else {
		self.debug("INSIDE JOIN");
		//  self.debug(data.outComehandler)
		//  self.debug(data)
		self.JOIN(data.query, data.conn, data.outComehandler);
	}
};
export const search = function (data) {
	const self = this;
	self.debug("THE search got a call");
	if (typeof data.query === "function") {
		data.query();
	} else {
		self.debug("INSIDE SEARCH");
		//  self.debug(data.outComehandler)
		//  self.debug(data)
		self.SEARCH(data.query, data.conn, data.outComehandler, data.connector);
	}
};
export const TRANSACTION = function (
	collections,
	conn,
	handler = null,
	connector,
) {
	const self = this;
	const pao = self.pao;
	let collectionsIds = [];
	let breakOut = false;
	for (let c = 0; c < collections.length; c++) {
		let i = collections[c];
		let fields = null;
		let sources = null;
		let own = null;
		if (!pao.pa_contains(i, "fields")) {
			handler("Required collection/table field missing");
			break;
		} else {
			if (pao.pa_contains(i.fields, "tables")) {
				sources = i.fields.tables;
				own = i.fields.own;
			}
		}
		sources ? (fields = self.combineFields(sources, own, collectionsIds)) : "";
		fields ? (i.fields = fields) : "";
		self
			.insert(i, conn, connector)
			.then((insert) => {
				collectionsIds.push(insert);
			})
			.catch((failedInsert) => {
				self.rollback(collectionsIds);
				handler(failedInsert, null);
				breakOut = true;
			});
		if (breakOut) break;
		if (c === collections.length - 1) {
			self.debug("Operation completed successfully");
			handler("Transaction Operation sucessful");
		}
	}
};
export const PROCEDURE = async function (
	collections,
	conn,
	handler = null,
	connector,
) {
	const self = this;
	const pao = self.pao;
	self.debug("THE PROCEDURE METHOD");
	self.debug(collections);
	self.debug(handler);
	//self.debug(conn)
	let collectionsIds = [];
	let breakOut = false;
	conn.getConnection(async (err, connection) => {
		self.infoSync(err);
		if (err)
			throw new Error("There was an error getting a connection from the pool");
		for (let c = 0; c < collections.length; c++) {
			let i = collections[c];
			let fields = null;
			let sources = null;
			let own = null;
			let action = null;
			let dictionary = null;
			self.infoSync("tHE FIELDS AND Tables from afar");
			self.infoSync(i);
			self.infoSync(i.fields);
			self.infoSync(i.tables);
			if (!pao.pa_contains(i, "fields") && i.action && i.action !== "delete") {
				handler("Required collection/table field missing");
				break;
			} else {
				if (pao.pa_contains(i.fields, "tables")) {
					self.debug("sources will be assigned A VALUE");
					sources = i.fields.tables;
					own = i.fields.own;
				} else if (pao.pa_contains(i.fields, "own")) {
					if (i.fields.own instanceof Array) {
						let dicts = i.fields.own.map((doc) => {
							return {
								...doc,
							};
						});
						i.fields = dicts;
					}
				}
			}
			sources
				? (fields = self.combineFields(sources, own, collectionsIds))
				: "";
			fields ? (i.fields = fields) : "";
			i.action ? (action = i.action) : (action = "insert");
			i.dictionary ? (dictionary = true) : dictionary;
			switch (action) {
				case "insert":
					{
						await self
							.insert(i, connection, connector)
							.then((insert) => {
								collectionsIds.push(insert);
							})
							.catch((failedInsert) => {
								handler(failedInsert, null);
								breakOut = true;
							});
					}
					break;
				case "update":
					{
						await self
							.procedureUpdate(i, connection, connector)
							.then((update) => {
								self.infoSync("THE UPDATED");
								collectionsIds.push(update);
							})
							.catch((failedUpdate) => {
								handler(failedUpdate, null);
								breakOut = true;
							});
					}
					break;
				case "delete":
					{
						await self
							.procedureDelete(i, connection, connector)
							.then((deleted) => {
								self.infoSync("THE DELETED");
								collectionsIds.push(deleted);
							})
							.catch((failedDelete) => {
								handler(failedDelete, null);
								breakOut = true;
							});
					}
					break;
				case "select":
					{
						await self
							.procedureSelect(i, connection, connector)
							.then((selected) => {
								self.infoSync("THE DELETED");
								collectionsIds.push(selected);
							})
							.catch((failedSelect) => {
								handler(failedSelect, null);
								breakOut = true;
							});
					}
					break;
				default:
					throw new Error("No valid table procedure action has been defined");
			}
			// await self.insert(i,conn)
			// .then((insert)=>{
			//     collectionsIds.push(insert)
			// })
			// .catch((failedInsert)=>{
			//       handler(failedInsert,null)
			//       breakOut = true
			// })
			if (breakOut) break;
			if (c === collections.length - 1) {
				self.debug("Operation completed successfully");
				self.debug(collectionsIds);
				connection.release();
				if (collectionsIds.length > 0) {
					self.debug("PROCEDURE IS COMPLETED");
					self.debug(collectionsIds);
					let savedData = null;
					self.infoSync("THE COLLECTIONS");
					self.infoSync(collectionsIds);
					self.infoSync(collectionsIds[0]);
					// handler(null,{user:{username: collectionsIds[0].fields.email}})
					if (collectionsIds[0].isDelete) {
						savedData = collectionsIds.map((sd) => {
							return {
								documentID: sd.collectionAlt,
								document: { ...sd.fields },
								isDeleted: sd.isDeleted,
							};
						});
						return handler(null, { user: savedData });
					} else if (
						collectionsIds[0].isUpdate ||
						collectionsIds[0].collectionAlt
					) {
						savedData = collectionsIds.map((sd) => {
							return {
								documentID: sd.collectionAlt,
								document: { ...sd.fields },
								isUpdated: sd.isUpdated,
							};
						});
						return handler(null, { user: savedData });
					} else {
						return handler(null, { user: collectionsIds[0].fields });
					}
				} else {
					return handler("An insert has went wrong");
				}
			}
		}
	});
};
export const insert = function (inset, conn, connector) {
	let self = this;
	let pao = pao;
	return new Promise(function (resolve, reject) {
		// do a thing, possibly async, then…
		self.debug("Executing the insert promise");
		self.infoSync("THE INSET");
		self.infoSync(inset);
		let sql = "";
		let queryAttributes = "";
		let escaped = [];
		let sqlValues = ``;
		let sqlKeys = `(`;
		!inset.dictionary
			? ((sql = `INSERT INTO ?? SET ?`),
			  (queryAttributes = [inset.name, inset.fields]),
			  (sql = connector.format(sql, queryAttributes)))
			: // eslint-disable-next-line no-unused-vars
			  ((escaped = inset.fields.map((di, i) => {
					let values = Object.entries(di);
					let escapedValues = {};
					sqlValues += `(`;
					values.forEach((v, ii) => {
						i === 0
							? ii === values.length - 1
								? (sqlKeys += `${v[0]}`)
								: (sqlKeys += `${v[0]},`)
							: "";
						escapedValues[v[0]] = conn.escape(v[1]);
						if (ii === values.length - 1) {
							//  i === 0 ? sqlKeys += `${v[0]}` : ''
							sqlValues += `${escapedValues[v[0]]}`;
						} else {
							sqlValues += `${escapedValues[v[0]]},`;
						}
					});
					if (i === inset.fields.length - 1) {
						inset.fields.length === 1 ? (sqlKeys += `)`) : "";
						sqlValues += `)`;
					} else {
						i === 0 ? (sqlKeys += `)`) : "";
						sqlValues += `),`;
					}
					return escapedValues;
			  })),
			  (sql = `INSERT INTO ${inset.name} ${sqlKeys} VALUES ${sqlValues}`));
		//     let sql = `INSERT INTO ?? SET ?`;
		// let queryAttributes = [inset.name,inset.fields];
		// sql = connector.format(sql, queryAttributes);
		//  let sql = `INSERT INTO ${data.table} SET ?`
		self.infoSync("THE SQL");
		self.infoSync(sql);
		conn.query(sql, function (e, r) {
			if (e) {
				self.debug("Promise is rejecting");
				reject(e);
			} else {
				//{table: 'jo_job_alert',opiks: ['fuxin.count.options[*].as[alertsCount]'],conditions:[`u_id EQUALS ${uid}`]}
				self.findOne({
					conn: conn,
					table: inset.name,
					connector: connector,
					//query:{user:{id: r.insertId}},
					query: {
						returnFields: ["*"],
						conditions: [`id EQUALS ${r.insertId}`],
					},
					outComehandler: (e = null, r = null, data = null) => {
						let insert = {};
						if (e) {
							self.debug("the errorINSERT");
							self.debug(e);
							self.debug(data);
							insert.error = e;
							insert.lastInsert = data.query.user.id;
							insert.fields = null;
							insert.collection = data.table;
							insert.collectionAlt = inset.altName ? inset.altName : "";
							self.debug("Promise is Resolving with findOne error");
							self.debug(insert);
							resolve(insert);
						} else {
							self.infoSync("THE RESULT FROM FIND");
							self.infoSync(r);
							self.infoSync(r[0].email);
							self.infoSync(inset.name);
							let foundUser = r[0];
							insert.lastInsert = foundUser.id;
							insert.fields = { ...foundUser };
							insert.collection = inset.name;
							insert.collectionAlt = inset.altName ? inset.altName : "";
							// throw new Error()
							self.debug("Promise is Resolving with Find SUCCESS");
							self.debug(insert);
							resolve(insert);
						}
					},
				});
			}
		});
	});
};
export const procedureUpdate = function (update, conn, connector) {
	const self = this;
	// self.infoSync('THE UPDATE IN PROCEDUREUPDATE')
	// self.infoSync(update)
	// let sets = Object.entries(update.fields)
	// let set = sets.map((f,i)=>{})
	return new Promise(function (resolve) {
		self.updateOne({
			conn,
			connector,
			update: update,
			query: {
				set: [
					...Object.entries(update.fields).map((f) => {
						return { [f[0]]: f[1] };
					}),
				],
				conditions: [update.condition],
				table: update.name,
			},
			outComehandler: (e = null, r = null, data = null) => {
				self.infoSync("THE UPDATE DATA");
				self.infoSync(data);
				let update = {};
				if (e) {
					self.debug("the errorUDPATE");
					self.debug(e);
					self.debug(data);
					self.infoSync("THE ERROR");
					self.infoSync(e);
					update.error = e;
					update.fields = null;
					update.collection = data.name;
					update.collectionAlt = data.altName ? data.altName : "";
					self.debug("Promise is Resolving with findOne error");
					self.debug(insert);
					resolve(update);
				} else {
					self.infoSync("THE SUCCESS");
					self.infoSync(r);
					// self.infoSync(data)
					if (
						(r.affectedRows && r.affectedRows > 0) ||
						(r.changedRows && r.changedRows > 0)
					) {
						self.infoSync(data.updateKeyID);
						update.lastInsert = data.updateKey;
						update.fields =
							data.updateKey && data.updateKeyID
								? { ...data.fields, [data.updateKeyID]: data.updateKey }
								: { ...data.fields };
						update.collection = data.name;
						update.collectionAlt = data.altName ? data.altName : "";
						update.affectedRows = r.affectedRows;
						update.isUpdate = true;
						update.isUpdated = true;
					} else {
						update.lastInsert = data.updateKey;
						// update.fields = {...data.fields,[data.updateKeyID]: data.updateKey}
						update.fields =
							data.updateKey && data.updateKeyID
								? { ...data.fields, [data.updateKeyID]: data.updateKey }
								: { ...data.fields };
						update.collection = data.name;
						update.collectionAlt = data.altName ? data.altName : "";
						update.affectedRows = 0;
						update.isUpdate = true;
						update.isUpdated = false;
					}
					self.debug("Promise is Resolving with FindOne SUCCESS");
					self.debug(update);
					resolve(update);
				}
			},
		});
	});
};
export const procedureDelete = function (toDelete, conn, connector) {
	const self = this;
	// self.infoSync('THE UPDATE IN PROCEDUREUPDATE')
	// self.infoSync(update)
	// let sets = Object.entries(update.fields)
	// let set = sets.map((f,i)=>{})
	return new Promise(function (resolve) {
		self.remove({
			conn,
			connector,
			delete: toDelete,
			query: { conditions: [toDelete.condition], table: toDelete.name },
			outComehandler: (e = null, r = null, data = null) => {
				let update = {};
				if (e) {
					self.debug("the errorDelete");
					self.debug(e);
					self.debug(data);
					self.infoSync("THE ERROR");
					self.infoSync(e);
					update.error = e;
					update.fields = null;
					update.collection = data.name;
					update.collectionAlt = data.altName ? data.altName : "";
					self.debug("Promise is Resolving with findOne error");
					self.debug(insert);
					resolve(update);
				} else {
					self.infoSync("THE DELETE SUCCESS");
					self.infoSync(r);
					// self.infoSync(data)
					if (r.affectedRows && r.affectedRows > 0) {
						// update.fields = {...data.fields}
						update.collection = data.name;
						update.collectionAlt = data.altName ? data.altName : "";
						update.fields = { ...data.fields };
						update.isDelete = true;
						update.isDeleted = true;
					} else {
						// update.fields = {...data.fields,[data.updateKeyID]: data.updateKey}
						// update.fields = {...data.fields}
						update.collection = data.name;
						update.collectionAlt = data.altName ? data.altName : "";
						update.isDelete = true;
						update.isDeleted = false;
					}
					self.debug("Promise is Resolving with FindOne SUCCESS");
					self.debug(update);
					resolve(update);
				}
			},
		});
	});
};
export const procedureSelect = function (select, conn, connector) {
	const self = this;
	// self.infoSync('THE UPDATE IN PROCEDUREUPDATE')
	// self.infoSync(update)
	// let sets = Object.entries(update.fields)
	// let set = sets.map((f,i)=>{})
	return new Promise(function (resolve) {
		self.find({
			conn: conn,
			select: select,
			table: select.name,
			connector: connector,
			//query:{user:{id: r.insertId}},
			query: { returnFields: select.fields, conditions: select.conditions },
			outComehandler: (e = null, r = null, data = null) => {
				let select = {};
				if (e) {
					self.debug("the errorINSERT");
					self.debug(e);
					self.debug(data);
					select.error = e;
					select.lastInsert = data.query.user.id;
					select.fields = null;
					select.collection = data.table;
					self.debug("Promise is Resolving with findOne error");
					self.debug(insert);
					resolve(insert);
				} else {
					self.infoSync("THE RESULT FROM FIND");
					self.infoSync(r);
					self.infoSync(r[0].email);
					self.infoSync(select.name);
					let foundUser = r[0];
					select.lastInsert = foundUser.id;
					select.fields = { ...foundUser };
					select.collection = select.name;
					// throw new Error()
					self.debug("Promise is Resolving with Find SUCCESS");
					self.debug(select);
					resolve(select);
				}
			},
		});
	});
};
export const JOIN = async function (join, conn, handler = null) {
	const self = this;
	self
		.joinExek(join, conn)
		.then((result) => {
			self.debug("jOIN is successful, sending results to the requester");
			self.debug(result);
			handler(null, result);
		})
		.catch((failedRequest) => {
			self.debug("JOIN FAILED");
			self.debug(failedRequest);
			handler(failedRequest, null);
		});
};
export const SEARCH = async function (search, conn, handler = null, connector) {
	const self = this;
	const pao = self.pao;
	self.debug("THE SEARCH search object contents");
	self.debug(search);
	if (!pao.pa_contains(search, "batch")) {
		self
			.searchExek(search, conn, connector)
			.then((result) => {
				self.debug("search is successful, sending results to the requester");
				// self.debug(result)
				handler(null, result);
			})
			.catch((failedRequest) => {
				self.debug("search FAILED");
				self.debug(failedRequest);
				handler(failedRequest, null);
			});
	} else {
		let resultSet = [];
		let batch = search.search;
		for (let s = 0; s < batch.length; s++) {
			await self
				.searchExek(batch[s], conn, connector)
				.then((result) => {
					self.debug("search is successful, pushing results to the resultSet");
					// self.debug(result)
					resultSet.push(result);
					if (s === batch.length - 1) {
						self.debug("Operation completed successfully");
						// self.debug(resultSet)
						handler(null, resultSet);
					}
					// handler(null,result)
				})
				.catch((failedRequest) => {
					self.debug("search FAILED");
					self.debug(failedRequest);
					resultSet.push({
						item: s,
						errorMessage: `Item of ${s} position has failed`,
						error: failedRequest,
					});
					// handler(failedRequest,null)
				});
		}
	}
};
export const combineFields = function (tables, own, ids) {
	const self = this;
	let fields = {};
	self.debug("COMBINE FIELDS GETS A CALL");
	self.infoSync("THE TABLES");
	self.infoSync(tables);
	self.infoSync(ids);
	tables.forEach((v) => {
		for (let co = 0; co < ids.length; co++) {
			if (ids[co].collection === v.name) {
				v.values.forEach((vv) => {
					self.debug("THE VV");
					self.debug(vv);
					let fieldValuePair = vv.split(".");
					self.debug("FIELD VALUE PAIR");
					self.debug(fieldValuePair);
					fields[fieldValuePair[1]] = ids[co].fields[fieldValuePair[0]];
				});
				break;
			}
		}
	});
	let keys = Object.keys(own);
	self.debug("THE KEYS OF OWN");
	self.debug(keys);
	self.infoSync("THE KEYS OF OWN");
	self.infoSync(keys);
	if (own instanceof Array) {
		let dictFields = own.map((docu) => {
			return {
				...fields,
				...docu,
			};
		});
		self.infoSync("THE DICTIONARY FIELDS");
		self.infoSync(dictFields);
		return dictFields;
	} else {
		let keys = Object.keys(own);
		self.debug("THE KEYS OF OWN");
		self.debug(keys);
		self.infoSync("THE KEYS OF OWN");
		self.infoSync(keys);
		keys.forEach((k) => {
			fields[k] = own[k];
		});
		self.debug("THE FIELDS");
		self.debug(fields);
		self.infoSync("THE FIELDS");
		self.infoSync(fields);
		return fields;
	}
};
export const rollback = function (rolbacks) {
	const self = this;
	rolbacks.forEach((roll) => {
		// eslint-disable-next-line no-undef
		self.deleteOne({ id: roll.lastInsert }, conn);
	});
};
export const joinExek = function (join, conn, connector) {
	let self = this;
	return new Promise(function (resolve, reject) {
		// do a thing, possibly async, then…
		self.debug("Executing the JOIN promise");
		let options = {
			fields: join.returnFields,
			from: {
				table: join.tables[0],
				condition: self.joinConditionsFormat(join.conditions),
			},
			joinPoints: self.joinConditionsFormat(join.joinPoints, "ON"),
			tables: join.tables.splice(1, join.tables.length),
			type: join.type.toUpperCase(),
			length: join.joins,
		};
		let sql = self.joinStatement(options);
		let queryAttributes = [options.from.table, options.tables[0]];
		self.debug("THE SQL BEFORE FORMAT");
		self.debug(sql);
		sql = connector.format(sql, queryAttributes);
		self.debug(sql);
		conn.query(sql, function (e, r) {
			if (e) {
				self.debug("Promise is rejecting JOIN");
				self.debug(e);
				reject(e);
			} else {
				self.debug("Promise is Resolving JOIN");
				self.debug(r);
				self.debug(r[0]);
				resolve(r[0]);
			}
		});
	});
};
export const joinConditionsFormat = function (conditions, type = null) {
	const self = this;
	self.debug("CONDITIONS");
	self.debug(conditions);
	if (type) {
		let cons = conditions;
		let condition = [];
		cons.forEach((con) => {
			let conList = con.trim().split(" ");
			let operand = "=";
			condition.push(`${conList[0]} ${operand} ${conList[2]}`);
		});
		self.debug("THE JOIN ON CONDITION");
		self.debug(condition);
		return condition;
	} else {
		let cons = conditions;
		let condition = "";
		cons.forEach((con) => {
			self.debug("THE con ITEM");
			self.debug(con);
			let conList = con.trim().split(" ");
			self.debug("THE CONLIST");
			self.debug(conList);
			let operand = "";
			switch (conList[1]) {
				case "EQUALS":
					operand = "=";
					break;
				case "ISGREATEROREQUALS":
					operand = ">=";
					break;
				case "ISLESSOREQUALS":
					operand = "<=";
					break;
				default:
					operand = "=";
			}
			condition += `${conList[0]} ${operand} '${conList[2]}'`;
		});
		self.debug("THE JOIN FROM CONDITION");
		self.debug(condition);
		return condition.trim();
	}
};
export const joinStatement = function (options) {
	const self = this;
	self.debug("THE JOIN OPTIONS");
	self.debug(options);
	switch (options.length) {
		case 3:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               WHERE ${options.from.condition}
               
               `;
		case 4:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               JOIN options.tables[2]
                  ON ${options.conditions[2]}
               WHERE ${options.from.condition}
               
               `;
		case 5:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               JOIN options.tables[2]
                  ON ${options.conditions[2]} 
               JOIN options.tables[3]
                  ON ${options.conditions[3]}
               WHERE ${options.from.condition}
               
               `;
		case 6:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               JOIN options.tables[2]
                  ON ${options.conditions[2]} 
               JOIN options.tables[3]
                  ON ${options.conditions[3]}
               JOIN options.tables[4]
                 ON ${options.conditions[4]}
               WHERE ${options.from.condition}
               
               `;
		case 7:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               JOIN options.tables[2]
                  ON ${options.conditions[2]} 
               JOIN options.tables[3]
                  ON ${options.conditions[3]}
               JOIN options.tables[4]
                  ON ${options.conditions[4]}
                JOIN options.tables[5]
                  ON ${options.conditions[5]}
               WHERE ${options.from.condition}
               
               `;
		case 8:
			return `SELECT ${options.fields}
               FROM ${options.from.table}
               JOIN ${options.tables[0]}
                  ON ${options.conditions[0]}
               JOIN options.tables[1]
                  ON ${options.conditions[1]}
               JOIN options.tables[2]
                  ON ${options.conditions[2]} 
               JOIN options.tables[3]
                  ON ${options.conditions[3]}
               JOIN options.tables[4]
                  ON ${options.conditions[4]}
                JOIN options.tables[5]
                  ON ${options.conditions[5]}
                JOIN options.tables[6]
                  ON ${options.conditions[6]}
               WHERE ${options.from.condition}
               
               `;
		default:
			return `SELECT ${options.fields}
               FROM  ??
               JOIN  ${options.tables[0]}
                  ON ${options.joinPoints[0]}
               WHERE ${options.from.condition}
               `;
	}
};
export const searchExek = function (search, conn, connector) {
	const self = this;
	const contains = self.pao.pa_contains;
	self.debug("THE SEARCH");
	self.debug(search);
	return new Promise(function (resolve, reject) {
		// do a thing, possibly async, then…
		self.debug("Executing the search promise");
		let sql = "";
		let attribs = null;
		let sqliks = self.searchStatement(self.searchOptions(search));
		self.debug("THE SQLKIKS OBJECT");
		self.debug(sqliks);
		contains(sqliks.attribs, "tables")
			? (attribs = [sqliks.attribs.from.table, ...sqliks.attribs.tables])
			: (attribs = [sqliks.attribs.from.table]);
		sql = sqliks.statement;
		let queryAttributes = attribs;
		self.debug("THE SQL BEFORE FORMAT");
		self.debug(sql);
		sql = connector.format(sql, queryAttributes);
		self.debug(sql);
		// self.infoSync('THE SEARCH SQL')
		// self.infoSync(sql)
		conn.query(sql, function (e, r) {
			if (e) {
				self.debug("Promise is rejecting search");
				self.debug(e);
				reject(e);
			} else {
				self.debug("Promise is Resolving search");
				//  self.debug(r)
				//  self.debug(r[0])
				self.infoSync("THE SEARCH RESULTS");
				self.infoSync(r);
				resolve(r);
			}
		});
	});
};
export const searchConditionsFormat = function (conditions, type = null) {
	const self = this;
	self.debug("CONDITIONS");
	self.debug(conditions);
	if (type) {
		let condition = self.parseFormatCondition(conditions, type);
		self.debug("THE search ON CONDITION");
		self.debug(condition);
		return condition;
	} else {
		let cons = conditions;
		let condition = "";
		cons.forEach((con) => {
			if (con.indexOf("GROUP::") >= 0) {
				self.debug("CONDITION FROM SEARCHCONDITIONFORMAT");
				self.debug(con);
				condition += self.parseGroup(con);
			} else {
				condition += self.parseFormatCondition(con);
			}
			/*self.debug('THE con ITEM')
            self.debug(con)
            let conList = con.trim().split(' ')
            self.debug('THE CONLIST')
            self.debug(conList)
            let operand = ''
            let leftoperand = ''
            let multiCon = false
            let match = false
        
            if(conList[0].trim() === 'MATCH' || conList[1].trim() === 'MATCH'){
        
              
              if(conList.indexOf('AGAINST') > 0 && conList.length >= 5){
        
        
                let oCon = conList.slice(0)
        
                self.debug('THE O CON')
                self.debug(oCon)
                 multiCon = oCon[0].trim().toUpperCase() !== 'MATCH' ? true : false
        
                let matchFields = ''
                let matchKeys = ''
        
                if(multiCon){
                  
                    matchFields = oCon[2].trim()
                  matchKeys = oCon[4].trim()
                  
                }else{
                    
                      matchFields = oCon[1].trim()
                    matchKeys = oCon[3].trim()
                }
                
        
                matchFields[0] === '[' ? matchFields = matchFields.slice(1,matchFields.length -1) : ''
                matchKeys[0] === '[' ? matchKeys = matchKeys.slice(1,matchKeys.length - 1) : ''
                self.debug('THE MATCH FIELDS')
                self.debug(matchFields)
                let op = ''
                operand = multiCon ? oCon[3].trim() : oCon[2].trim()
                let mode = multiCon ? oCon[5] : oCon[4]
              
        
              
                switch(mode){
        
                case 'BOOLEAN' :
                  op = `AGAINST ("${matchKeys}"" IN BOOLEAN MODE) `
                break;
                case 'QUERY' :
                  op = `AGAINST ("${matchKeys}" IN QUERY EXPRESSION MODE) `
                break;
                
                default:
                  op = `AGAINST ("${matchKeys}" IN NATURAL LANGUAGE MODE) `
        
                }
        
                conList[0] = multiCon ? `${oCon[0]} MATCH (${matchFields}) ${op}` :`MATCH (${matchFields}) ${op}`
              //  leftoperand = ` ${op}`
                match = true
        
        
                
        
              }else{
        
        
              }
        
            }else{
        
        
              
                let oCon = conList.slice(0)
        
                self.debug('THE O CON')
                self.debug(oCon)
                multiCon = oCon[0].trim().toUpperCase() === ('AND' || 'OR' || 'NOT') ? true : false
                let operator = multiCon ? conList[2] : conList[1]
        
              switch(operator){
        
                case 'EQUALS' :
                  operand = '='
                  break;
                case 'ISGREATEROREQUALS' :
                  operand = '>='
                  break;
                case 'ISLESSOREQUALS' :
                  operand = '<='
                  break;
                case 'ISLIKE' :
                  operand = 'LIKE'
                  break;
                case 'ISIN' :
                operand = 'IN'
                break;
                case 'ISREGEX' :
                  operand = 'REGEXP'
                  break;
                case 'ISNOT' :
                operand = 'NOT'
                break;
                case 'ISNOTNULL' :
                operand = 'IS NOT NULL'
                break;
                case 'ISNULL' :
                operand = 'IS NULL'
                break;
                default:
                  operand = '='
              }
        
            leftoperand = multiCon ? conList[3] : conList[2]
        
            }
        
            match ? condition += `${conList[0]}` : multiCon ? condition += ` ${conList[0]} ${conList[1]} ${operand} '${leftoperand}' `
            : condition += `${conList[0]} ${operand} '${leftoperand}' `*/
		});
		self.debug("THE search FROM CONDITION");
		self.debug(condition);
		return condition.trim();
	}
};
export const searchStatement = function (options) {
	const self = this;
	self.debug("THE search OPTIONSSTATEMENT");
	self.debug(options);
	const contains = self.pao.pa_contains;
	if (!options) return null;
	if (contains(options, "length")) {
		let sqlAttribs = {};
		sqlAttribs.attribs = { from: options.from, tables: options.tables };
		self.debug("THE OPTIONS LENGTH");
		self.debug(options.length);
		let limit = " ";
		let sort = options.sort ? self.sort(options.sort) : " ";
		options.take
			? (limit = self.limit(options.take, "take"))
			: options.range
			? (limit = self.limit(options.range, "range"))
			: " ";
		switch (options.length) {
			case 3:
				sqlAttribs.statement = `SELECT ${options.fields}
                FROM ??
                JOIN ??
                  ON ${options.joinPoints[0]}
                JOIN ??
                  ON ${options.joinPoints[1]}
                WHERE ${options.from.condition}
                ${sort}
                ${limit}
                
                `;
				break;
			case 4:
				sqlAttribs.statement = `SELECT ${options.fields}
                FROM ${options.from.table}
                JOIN ${options.tables[0]}
                  ON ${options.joinPoints[0]}
                JOIN ${options.tables[1]}
                  ON ${options.joinPoints[1]}
                JOIN ${options.tables[2]}
                  ON ${options.joinPoints[2]}
                WHERE ${options.from.condition}
                ${sort}
                ${limit}
                `;
				break;
			case 5:
				sqlAttribs.statement = `SELECT ${options.fields}
                FROM ${options.from.table}
                JOIN ${options.tables[0]}
                  ON ${options.joinPoints[0]}
                JOIN ${options.tables[1]}
                  ON ${options.joinPoints[1]}
                JOIN ${options.tables[2]}
                  ON ${options.joinPoints[2]} 
                JOIN ${options.tables[3]}
                  ON ${options.joinPoints[3]}
                WHERE ${options.from.condition}
                ${sort}
                ${limit}
                `;
				break;
			default:
				sqlAttribs.statement = `SELECT ${options.fields}
                FROM  ??
                JOIN  ${options.tables[0]}
                  ON ${options.joinPoints[0]}
                WHERE ${options.from.condition}
                ${sort}
                ${limit}
              `;
		}
		return sqlAttribs;
	} else {
		let sqlAttribs = {};
		sqlAttribs.attribs = { from: options.from };
		let limit = " ";
		let sort = options.sort ? self.sort(options.sort) : " ";
		options.take
			? (limit = self.limit(options.take, "take"))
			: options.range
			? (limit = self.limit(options.range, "range"))
			: " ";
		if (contains(options.from, "condition")) {
			sqlAttribs.statement = `SELECT ${options.fields}
              FROM  ??
              WHERE ${options.from.condition}
              ${sort}
              ${limit}
              `;
		} else {
			sqlAttribs.statement = `SELECT ${options.fields}
                              FROM  ??
                              ${sort}
                              ${limit}
                              `;
		}
		return sqlAttribs;
	}
};
export const searchOptions = function (i, multiSet = false) {
	const self = this;
	let pao = self.pao;
	let contains = pao.pa_contains;
	let setTables = "";
	setTables = multiSet ? [...i.tables] : "";
	self.debug("THE search BATCH ITEM");
	self.debug(i);
	self.debug(i);
	if (contains(i, ["joins", "conditions", "joinPoints"])) {
		self.debug(
			"THE SEARCH ITEM CONTAINS BOTH JOINS,CONDITIONS, AND JOINPOINTS",
		);
		let options = {};
		options.from = {
			table: i.tables[0],
			condition: self.searchConditionsFormat(i.conditions),
		};
		options.joinPoints = i.joinPoints
			? self.searchConditionsFormat(i.joinPoints, "ON")
			: null;
		options.length = i.tables.length;
		options.tables = i.tables.splice(1, i.tables.length);
		//  contains(i,['returnFields','opiks']) ? options.fields = self.searchFieldsFormat(i.opiks,i.returnFields) : ''
		//  contains(i,'returnFields') ? i.returnFields.length === 1 && i.returnFields[0].trim() === 'all' ? options.fields='*' : options.fields= i.returnFields : ''
		//  contains(i,'opiks') ?  options.fields = self.searchFieldsFormat(i.opiks) : ''
		contains(i, ["returnFields", "opiks"])
			? (options.fields = self.searchFieldsFormat(i.opiks, i.returnFields))
			: contains(i, "opiks")
			? (options.fields = self.searchFieldsFormat(i.opiks))
			: contains(i, "returnFields")
			? i.returnFields.length === 1 && i.returnFields[0].trim() === "all"
				? (options.fields = "*")
				: (options.fields = i.returnFields)
			: "";
		contains(i, "type") ? (options.type = i.type) : "";
		contains(i, "take") ? (options.take = i.take) : "";
		contains(i, "range") ? (options.range = i.range) : "";
		contains(i, "soundex") ? (options.soundex = i.soundex) : "";
		contains(i, "sort") ? (options.sort = i.sort) : "";
		contains(i, "set")
			? (options.set = multiSet ? self.set(i.set, setTables) : self.set(i.set))
			: "";
		//  contains(i,'takeFrom') ? options.takeFrom = i.takeFrom : ''
		contains(i, "takeFrom")
			? i.takeFrom.conditions
				? ((options.takeFrom = i.takeFrom),
				  (options.takeFrom.condition = self.searchConditionsFormat(
						i.takeFrom.conditions,
				  )))
				: (options.takeFrom = i.takeFrom)
			: "";
		return options;
	} else if (contains(i, ["conditions"])) {
		let options = {};
		options.from = {
			table: i.tables[0],
			condition: self.searchConditionsFormat(i.conditions),
		};
		// contains(i,['returnFields','opiks']) ? options.fields = self.searchFieldsFormat(i.opiks,i.returnFields) : ''
		// contains(i,'returnFields') ? i.returnFields.length === 1 && i.returnFields[0].trim() === 'all' ? options.fields='*' : options.fields= i.returnFields : ''
		// contains(i,'opiks') ?  options.fields = self.searchFieldsFormat(i.opiks) : ''
		contains(i, ["returnFields", "opiks"])
			? (options.fields = self.searchFieldsFormat(i.opiks, i.returnFields))
			: contains(i, "opiks")
			? (options.fields = self.searchFieldsFormat(i.opiks))
			: contains(i, "returnFields")
			? i.returnFields.length === 1 && i.returnFields[0].trim() === "all"
				? (options.fields = "*")
				: (options.fields = i.returnFields)
			: "";
		contains(i, "type") ? (options.type = i.type) : "";
		contains(i, "take") ? (options.take = i.take) : "";
		contains(i, "range") ? (options.range = i.range) : "";
		contains(i, "soundex") ? (options.soundex = i.soundex) : "";
		contains(i, "sort") ? (options.sort = i.sort) : "";
		contains(i, "set")
			? (options.set = multiSet ? self.set(i.set, setTables) : self.set(i.set))
			: "";
		contains(i, "takeFrom")
			? i.takeFrom.conditions
				? ((options.takeFrom = i.takeFrom),
				  (options.takeFrom.condition = self.searchConditionsFormat(
						i.takeFrom.conditions,
				  )))
				: (options.takeFrom = i.takeFrom)
			: "";
		return options;
	} else if (contains(i, "tables") && i.tables instanceof Array) {
		let options = {};
		options.from = { table: i.tables[0] };
		contains(i, ["returnFields", "opiks"])
			? (options.fields = self.searchFieldsFormat(i.opiks, i.returnFields))
			: contains(i, "opiks")
			? (options.fields = self.searchFieldsFormat(i.opiks))
			: contains(i, "returnFields")
			? i.returnFields.length === 1 && i.returnFields[0].trim() === "all"
				? (options.fields = "*")
				: (options.fields = i.returnFields)
			: "";
		// contains(i,'opiks') ?  options.fields = self.searchFieldsFormat(i.opiks) : ''
		contains(i, "type") ? (options.type = i.type) : "";
		contains(i, "take") ? (options.take = i.take) : "";
		contains(i, "range") ? (options.range = i.range) : "";
		contains(i, "soundex") ? (options.soundex = i.soundex) : "";
		contains(i, "sort") ? (options.sort = i.sort) : "";
		contains(i, "set")
			? (options.set = multiSet ? self.set(i.set, setTables) : self.set(i.set))
			: "";
		contains(i, "takeFrom")
			? i.takeFrom.conditions
				? ((options.takeFrom = i.takeFrom),
				  (options.takeFrom.condition = self.searchConditionsFormat(
						i.takeFrom.conditions,
				  )))
				: (options.takeFrom = i.takeFrom)
			: "";
		return options;
	} else {
		return null;
	}
};
export const searchFieldsFormat = function (fields, rFields = null) {
	const self = this;
	self.debug("THE SELECT STATEMENT OPIKS OBJECT");
	self.debug(fields);
	self.debug(rFields);
	let fis = fields;
	let keyword = "";
	let otherFields = rFields ? rFields.join(",") : "";
	let all = "";
	let fieldstatement = "";
	let multiFields = [];
	let allFields = otherFields.indexOf("all") >= 0;
	let lastCondition = false;
	self.debug("THE OTHER FIELDS");
	self.debug(otherFields);
	self.debug(otherFields.indexOf("all") >= 0);
	for (let fi = 0; fi < fis.length; fi++) {
		if (fis[fi].indexOf("fuxin") >= 0 || fis[fi].indexOf("field") >= 0) {
			multiFields.push(true);
		}
		if (multiFields.length > 1) {
			break;
		}
	}
	fis.forEach((f, i) => {
		let formated = self.fieldFormat(f);
		if (formated instanceof Object) {
			keyword = formated.value.toUpperCase();
		} else {
			self.debug("THE FORMATED");
			self.debug(formated);
			self.debug(allFields);
			self.debug(otherFields);
			if (i === fis.length - 1) {
				lastCondition = true;
			}
			fieldstatement += allFields
				? multiFields && i !== fis.length - 1
					? `${formated},`
					: formated
				: lastCondition && rFields === null
				? `${formated}`
				: `${formated},`;
		}
	});
	allFields === true ? (all = "*,") : "";
	return allFields
		? `${all} ${keyword} ${fieldstatement}`
		: `${all} ${keyword} ${fieldstatement} ${otherFields}`;
};
export const fieldFormat = function (field, from = null) {
	const self = this;
	self.debug("THE SELECT STATEMENT OPIKS OBJECT FIELD FORMAT");
	self.debug(field);
	//  let splitFieldRegx = /\.(?![^\[]]*\]])/
	let nestedIntFuxin = "";
	let last =
		field.lastIndexOf(".as") >= 0 ? field.lastIndexOf(".as") : field.length;
	field.indexOf(".options[fuxin") >= 0
		? (nestedIntFuxin = field.slice(field.indexOf(".options[fuxin"), last))
		: "";
	self.debug("THE NESTEDINTFUXIN");
	self.debug(nestedIntFuxin);
	self.debug(field);
	nestedIntFuxin.trim() !== ""
		? (field = field.substr(0, field.indexOf(nestedIntFuxin)))
		: "";
	// nestedIntFuxin.trim() !== '' ? field =  : ''
	// let splicedArray = conList.splice(2)
	// self.debug('THE SPLICED ARRAY')
	// self.debug(splicedArray)
	// self.debug(splicedArray.join(' '))
	// conList[2] = splicedArray.join(' ');
	// self.debug(conList)
	// self.debug(conList[2].indexOf('['))
	//  let fieldList = field.trim().split('.')
	//  fieldList.length > 3 ? fieldList[3].indexOf('as[') < 0 ? fieldList[2] = fieldList.splice(2).join(' ') : '' : ''
	let fieldList = field.trim().split(".");
	nestedIntFuxin.trim() !== "" ? fieldList.push(nestedIntFuxin) : "";
	self.debug("THE FIELD LIST");
	self.debug(fieldList);
	let fieldstatement = null;
	//fuxin.date_sub.options[fuxin.now,INTERVAL ${intExp} ${intUnit}]
	let as =
		fieldList[0] === "fuxin"
			? fieldList.length > 3
				? `AS ${self.options(`${fieldList[3]}`, "as")}`
				: " "
			: " ";
	self.debug("THE as");
	self.debug(as);
	switch (fieldList[0]) {
		case "keyword":
			fieldstatement = from
				? fieldList[1].toUpperCase()
				: { statement: "keyword", value: fieldList[1].toUpperCase() };
			break;
		case "fuxin":
			fieldstatement = ` ${fieldList[1].toUpperCase()}(${self.options(
				`${fieldList[2]}`,
				"option",
			)}) ${as} `;
			break;
		case "field":
			if (fieldList.length === 3)
				fieldstatement = `${fieldList[1]} AS ${self.options(
					fieldList[2],
					"as",
				)}`;
			break;
		default:
			fieldstatement = "";
	}
	return fieldstatement.trim();
};
export const options = function (option, type = "") {
	const self = this;
	self.debug("THE CURRENT OPTION");
	self.debug(option);
	if (option !== "undefined") {
		let stripedOption = option.slice(
			option.indexOf("[") + 1,
			option.lastIndexOf("]"),
		);
		self.debug("OPTIONS: STRIPEDOPTION");
		self.debug(stripedOption);
		if (type === "as") {
			return `${stripedOption}`;
		} else if (type === "option") {
			let args = stripedOption.split(",");
			if (args instanceof Array && args.length > 1) {
				if (args[0].indexOf("keyword") >= 0) {
					return self.fieldFormat(args[0], true);
				} else if (args[0].indexOf("fuxin") >= 0) {
					if (args[1]) {
						return `${self.fieldFormat(args[0])},${args[1].trim()}`;
					} else {
						return self.fieldFormat(args[0]);
					}
				} else {
					return `${stripedOption}`;
				}
			} else {
				return args.join(",");
			}
		}
	} else {
		self.debug("THE OPTION IS UNDEFINED");
		self.debug(option);
		return "";
	}
};
export const sort = function (sort) {
	const self = this;
	self.debug("THE SORT GOT A RESPONSE");
	self.debug(sort);
	let sortArgs = sort.split(".");
	let sortFields = sort.slice(sort.indexOf("[") + 1, sort.lastIndexOf("]"));
	let sortStatement = "";
	if (sortArgs[0].indexOf("order") >= 0) {
		if (sortArgs.length > 1) {
			if (sortArgs[1].toUpperCase() === "DESC") {
				sortStatement = `ORDER BY ${sortFields} DESC`;
			} else {
				sortStatement = `ORDER BY ${sortFields}`;
			}
		} else {
			sortStatement = `ORDER BY ${sortFields}`;
		}
	} else if (sortArgs[0].indexOf("group") >= 0) {
		if (sortArgs.length > 1) {
			if (sortArgs[1].toUpperCase() === "DESC") {
				sortStatement = `GROUP BY ${sortFields} DESC`;
			} else {
				sortStatement = `GROUP BY ${sortFields} ASC`;
			}
		} else {
			sortStatement = `GROUP BY ${sortFields} ASC`;
		}
	}
	return sortStatement;
};
export const limit = function (limit, type = null) {
	let limitStatement = "";
	if (type === "take") {
		limitStatement = `LIMIT ${limit} OFFSET 0`;
	} else if (type === "range") {
		let ranges = limit.split(",");
		let offset = ranges[0];
		let count = ranges[1];
		limitStatement = `LIMIT ${count} OFFSET ${offset}`;
	}
	return limitStatement;
};
export const parseGroup = function (con, level = 1) {
	const self = this;
	const pao = self.pao;
	let isObject = pao.pa_isObject;
	//AND GROUP::2 START created_at FUXIN [ISGREATEROREQUALS fuxin.date_sub.options[fuxin.now,INTERVAL ${intExp} ${intUnit}]]
	let fullCon = "";
	let connector = "";
	let res = self.conditionsConnector(con);
	self.debug("THE RES VALUE");
	self.debug(res);
	if (isObject(res)) {
		self.debug("THE RES IS AN OBJECT");
		self.debug(res);
		con = res.condixion;
		connector = res.connector;
	}
	if (con.trim().indexOf("GROUP::") === 0) {
		self.debug("THE GROUP:: string is the first");
		//let groupRegx = /GROUP::/
		let exStr = con.replace("GROUP::", "").trim();
		let groupLen = 0;
		let startStr = "";
		let conStr = "";
		self.debug("THE extracted string");
		self.debug(exStr);
		if (typeof parseInt(exStr[0]) === "number") {
			self.debug("extStr type is a number");
			// eslint-disable-next-line no-unused-vars
			groupLen = parseInt(exStr[0]);
			startStr = exStr.slice(1).trim();
			if (startStr.indexOf("START") === 0 || startStr.indexOf("$") === 0) {
				conStr = startStr.replace("START", "").trim();
				self.debug(startStr);
				let groupCons = "";
				//  let groupL1Cons = ''
				//  let groupL2Cons = ''
				//  let groupL3Cons = ''
				let grouped = [];
				self.debug("PARSEGROUP EXECUTES THIS FAR");
				self.debug(conStr);
				if (level === 1) {
					groupCons = conStr.split(";");
					self.debug("LEVEL 1 GROUPCONS");
					self.debug(groupCons);
					grouped = groupCons.map((c) => {
						self.debug("THE C CONDITION");
						self.debug(c);
						self.debug(c.indexOf("GROUP::"));
						//  self.conditionsConnector()
						if (c.indexOf("GROUP::") >= 0) {
							return self.parseGroup(c, 2);
						} else {
							return self.parseFormatCondition(c);
						}
					});
				} else if (level === 2) {
					groupCons = conStr.split(",");
					self.debug("LEVEL 2 GROUPCONS");
					self.debug(groupCons);
					grouped = groupCons.map((c) => {
						// c = self.conditionsConnector(c)
						if (c.indexOf("GROUP::") >= 0) {
							return self.parseGroup(c, 3);
						} else {
							return self.parseFormatCondition(c);
						}
					});
				} else if (level === 3) {
					groupCons = conStr.split("|");
					grouped = groupCons.map((c) => {
						return self.parseFormatCondition(c);
					});
				}
				self.debug("GROUPED");
				self.debug(grouped);
				self.debug(groupCons);
				fullCon = `${connector} (${grouped.join(" ")})`;
				// eslint-disable-next-line no-empty
			} else {
			}
		}
	}
	self.debug("THE FULL GROUPED CONDITION TO BE RETURNED:");
	self.debug(fullCon);
	return fullCon;
};
export const parseFormatCondition = function (con, type = null) {
	const self = this;
	if (type) {
		let cons = con;
		let condition = [];
		cons.forEach((kon) => {
			// let conList = kon.trim().split(' ')
			let conList = kon.trim().match(/(\[[^\]]+\]|\S+)/g);
			let operand = "=";
			condition.push(`${conList[0]} ${operand} ${conList[2]}`);
		});
		self.debug("THE search ON CONDITION");
		self.debug(condition);
		return condition;
	} else {
		let condition = "";
		self.debug("THE con ITEM");
		self.debug(con);
		// let conList = con.trim().split(' ')
		// let conList = con.trim().match(/(?:"^\s\[]+|"[^"]*")+/g)
		let conList = con.trim().match(/(\[[^\]]+\]|\S+)/g);
		self.debug("THE CONLIST");
		self.debug(conList);
		let operand = "";
		let leftoperand = "";
		let multiCon = false;
		let match = false;
		let conFuxin = false;
		let whiteSpace = " ";
		if (
			conList[0].trim() === "MATCH" ||
			conList[1].trim() === "MATCH" ||
			conList[1].trim() === "FUXIN" ||
			conList[2].trim() === "FUXIN"
		) {
			if (conList.indexOf("AGAINST") > 0 && conList.length >= 5) {
				let oCon = conList.slice(0);
				self.debug("THE O CON");
				self.debug(oCon);
				multiCon = oCon[0].trim().toUpperCase() !== "MATCH" ? true : false;
				let matchFields = "";
				let matchKeys = "";
				if (multiCon) {
					matchFields = oCon[2].trim();
					matchKeys = oCon[4].trim();
				} else {
					matchFields = oCon[1].trim();
					matchKeys = oCon[3].trim();
				}
				matchFields[0] === "["
					? (matchFields = matchFields.slice(1, matchFields.length - 1))
					: "";
				matchKeys[0] === "["
					? (matchKeys = matchKeys.slice(1, matchKeys.length - 1))
					: "";
				self.debug("THE MATCH FIELDS");
				self.debug(matchFields);
				let op = "";
				operand = multiCon ? oCon[3].trim() : oCon[2].trim();
				let mode = multiCon ? oCon[5] : oCon[4];
				switch (mode) {
					case "BOOLEAN":
						op = `AGAINST ("${matchKeys}"" IN BOOLEAN MODE) `;
						break;
					case "QUERY":
						op = `AGAINST ("${matchKeys}" IN QUERY EXPRESSION MODE) `;
						break;
					default:
						op = `AGAINST ("${matchKeys}" IN NATURAL LANGUAGE MODE) `;
				}
				conList[0] = multiCon
					? `${oCon[0]} MATCH (${matchFields}) ${op}`
					: `MATCH (${matchFields}) ${op}`;
				//  leftoperand = ` ${op}`
				match = true;
			} else {
				//[ISGREATEROREQUALS fuxin.date_sub.options[fuxin.now,INTERVAL ${intExp} ${intUnit}]]
				//created_at FUXIN [ISGREATEROREQUALS fuxin.date_sub.options[fuxin.now,INTERVAL ${intExp} ${intUnit}]]
				let oCon = conList.slice(0);
				conFuxin = true;
				self.debug("THE O CON::FUXIN");
				self.debug(oCon);
				multiCon = oCon[1].trim().toUpperCase() !== "FUXIN" ? true : false;
				let fuxinIndex = multiCon ? 3 : 2;
				let splicedFuxinArr = oCon.splice(fuxinIndex);
				oCon.push(splicedFuxinArr.join(" "));
				self.debug(fuxinIndex);
				self.debug(oCon);
				//  self.debug(splicedFuxinArr)
				// if(oCon.indexOf('FUXIN') > 0){
				//   self.debug('THE FUXIN OP IN SEARCHCONDITIONS')
				//   self.debug(oCon)
				//   let splicedArray = multiCon ? oCon.splice(3) : oCon.splice(2)
				//   self.debug('THE SPLICED ARRAY')
				//   self.debug(splicedArray)
				//   self.debug(splicedArray.join(' '))
				//   multiCon ? oCon[3] = splicedArray.join(' ') : oCon[2] = splicedArray.join(' ');
				//   self.debug(oCon)
				//   self.debug(oCon[2].indexOf('['))
				//   // throw new Error()
				if (oCon[fuxinIndex].indexOf("[") >= 0) {
					self.debug("OTHER CONTENT IS IN THE SQUARE BRACKETS");
					let stripedSqBkts = oCon[fuxinIndex].slice(
						1,
						oCon[fuxinIndex].length - 1,
					);
					stripedSqBkts = stripedSqBkts.trim();
					// let splitRegex = /([.*?])/g
					self.debug("AFTER THE STRIPED HAS BEEN TRIMMED");
					self.debug(stripedSqBkts);
					let operator = stripedSqBkts.substr(0, stripedSqBkts.indexOf(" "));
					let functionalStr = stripedSqBkts.substr(
						stripedSqBkts.indexOf(" ") + 1,
					);
					self.debug("THE SPLITFUXINCONS");
					self.debug(operator);
					self.debug(functionalStr);
					let gotOperand = self.getOperand(operator);
					let bakedFuxin = self.fieldFormat(functionalStr);
					self.debug(gotOperand);
					self.debug(bakedFuxin);
					// throw new Error()
					condition = multiCon
						? `${oCon[0]} ${oCon[1]} ${gotOperand} ${bakedFuxin}`
						: `${oCon[0]} ${gotOperand} ${bakedFuxin}`;
					self.debug("THE CONDITION IN FUXIN TEST");
					self.debug(condition);
				}
				// }
			}
		} else {
			let oCon = conList.slice(0);
			self.debug("THE O CON");
			self.debug(oCon);
			let firstStrItem = oCon[0].trim().toUpperCase();
			multiCon =
				firstStrItem === "AND" ||
				firstStrItem === "OR" ||
				firstStrItem === "NOT"
					? true
					: false;
			let operator = multiCon ? conList[2] : conList[1];
			self.debug("THE MULTICON STATUS:::");
			self.debug(multiCon);
			self.debug(oCon);
			operand = self.getOperand(operator);
			// switch(operator){
			//   case 'EQUALS' :
			//     operand = '='
			//     break;
			//   case 'ISGREATEROREQUALS' :
			//     operand = '>='
			//     break;
			//   case 'ISLESSOREQUALS' :
			//     operand = '<='
			//     break;
			//   case 'ISLIKE' :
			//     operand = 'LIKE'
			//     break;
			//   case 'ISIN' :
			//   operand = 'IN'
			//   break;
			//   case 'ISREGEX' :
			//     operand = 'REGEXP'
			//     break;
			//   case 'ISNOT' :
			//   operand = 'NOT'
			//   break;
			//   case 'ISNOTNULL' :
			//   operand = 'IS NOT NULL'
			//   break;
			//   case 'ISNULL' :
			//   operand = 'IS NULL'
			//   break;
			//   default:
			//     operand = '='
			// }
			leftoperand = multiCon ? conList[3] : conList[2];
			leftoperand[0] === "["
				? (leftoperand = `'${leftoperand.slice(1, leftoperand.length - 1)}'`)
				: leftoperand.indexOf("KEY::") >= 0
				? (leftoperand = `${leftoperand.replace("KEY::", "").trim()}`)
				: (leftoperand = `'${leftoperand}'`);
			self.debug("THE VALUE OF THE LEFFFFFT OPERAND");
			self.debug(leftoperand);
			self.debug(leftoperand.indexOf("KEY::"));
		}
		if (!conFuxin) {
			match
				? (condition += `${conList[0]}`)
				: multiCon
				? (condition += `${whiteSpace} ${conList[0]} ${conList[1]} ${operand} ${leftoperand}`)
				: (condition += `${conList[0]} ${operand} ${leftoperand}`);
		}
		self.debug("THE search FROM CONDITION");
		self.debug(condition);
		return condition;
	}
};
export const getOperand = function (operator) {
	let operand = "";
	switch (operator) {
		case "EQUALS":
			operand = "=";
			break;
		case "ISGREATEROREQUALS":
			operand = ">=";
			break;
		case "ISLESSOREQUALS":
			operand = "<=";
			break;
		case "ISLIKE":
			operand = "LIKE";
			break;
		case "ISIN":
			operand = "IN";
			break;
		case "ISREGEX":
			operand = "REGEXP";
			break;
		case "ISNOT":
			operand = "NOT";
			break;
		case "ISNOTNULL":
			operand = "IS NOT NULL";
			break;
		case "ISNULL":
			operand = "IS NULL";
			break;
		default:
			operand = "=";
	}
	return operand;
};
export const conditionsConnector = function (c) {
	const self = this;
	let connector = {};
	self.debug("THE INDEX OF GROUP:: IN CONDITIONS CONNECTOR");
	self.debug(c.trim().indexOf("GROUP::"));
	self.debug(c);
	if (c.trim().indexOf("GROUP::") > 0) {
		self.debug("THE INDEX OF GROUP IS AT ONE");
		if (c.trim().indexOf("AND") === 0) {
			connector.connector = ` AND`;
			connector.condixion = c.replace("AND", "").trim();
		} else if (c.trim().indexOf("OR") === 0) {
			connector.connector = ` OR`;
			connector.condixion = c.replace("OR", "").trim();
		} else if (c.trim().indexOf("NOT") === 0) {
			connector.connector = ` NOT`;
			connector.condixion = c.replace("NOT", "").trim();
		}
		return connector;
	} else {
		return c;
	}
};
export const set = function (set, multiSets = false) {
	const self = this;
	const pao = self.pao;
	const objectToArray = pao.pa_objectToArray;
	self.debug("THE SET");
	self.debug(set);
	self.debug(multiSets);
	let setStrings = "";
	set.forEach((s, i) => {
		let setString = "";
		let modSet = objectToArray(s, true);
		self.debug("THE CONVERTED SET OBJECT");
		self.debug(modSet);
		modSet.forEach((col, pos) => {
			multiSets
				? (setString +=
						pos === modSet.length - 1
							? `${multiSets[i]}.${col.key} = "${col.value}"`
							: `${multiSets[i]}.${col.key} = "${col.value}", `)
				: (setString +=
						pos === modSet.length - 1
							? `${col.key} = "${col.value}"`
							: `${col.key} = "${col.value}", `);
		});
		setStrings += i === set.length - 1 ? `${setString}` : `${setString}, `;
		// let key = ''
		// let value = ''
		// key = Object.keys(s)[0]
		// value = s[Object.keys(s)[0]]
		// self.debug('THE LENGTH OF S')
		// self.debug(set.length)
		// self.debug(i)
		// setString += i === set.length - 1 ? `${key} = "${value}"` : `${key} = "${value}", `
	});
	self.debug("THE SETSTRINGS");
	self.debug(setStrings);
	return setStrings;
};
