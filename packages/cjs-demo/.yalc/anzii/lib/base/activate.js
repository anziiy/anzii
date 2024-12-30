import { logInitializations } from "./activiator_logs.js";
export const Activate = function (libs = []) {
	logInitializations("THE LIBS", libs);
	logInitializations("The esm modules", this.ESM.Esm);
	const core = new this.ANZII.CORE(this.ANZII.PILLAR);
	const pao = new this.ANZII.PAO(core);
	const isAppCli = pao.PROMPT.indexOf("cli") >= 0 ? true : false;
	const anziiCliWithServer = process.env?.ANZII_CLI_WITH_SERVER || null;
	const isAnziiCliWithServer =
		anziiCliWithServer && anziiCliWithServer === "true" ? true : false;
	logInitializations(`isAppCLi", ${isAppCli}`);
	logInitializations(`isAnziiCliWithServer", ${isAnziiCliWithServer}`);
	logInitializations(
		`isInitiliazeCliWithServer check",
		${isAppCli && isAnziiCliWithServer}`,
	);
	const initializeCliWithServer = isAppCli && isAnziiCliWithServer;
	let anziiloger = { Anziiloger: this.ESM.Esm.Anziiloger };
	let hitList = !initializeCliWithServer
		? ["System", "Middleware", "Router", "Request", "Server", "Parsers"]
		: [];
	let IO = this.ESM.Esm.IO ? { IO: this.ESM.Esm.IO } : null;
	let isPush = true;
	// logInitializations('ANZII PILLAR PROMPT')
	// logInitializations(pao.PROMPT)
	logInitializations(`ANZII CLI WITH SERVER", ${anziiCliWithServer}`);
	logInitializations(`IS ANZII CLI WITH SERVER", ${isAnziiCliWithServer}`);
	logInitializations(`Initialize CLI WITH SERVER", ${initializeCliWithServer}`);
	if (isAppCli) {
		// logInitializations('This should be a cli app')
		//  process.env.SUPPRESS_NO_CONFIG_WARNING = true

		if (IO) delete this.ESM.Esm.IO;

		if (!initializeCliWithServer) {
			for (let plugin in this.ESM.Esm) {
				if (hitList.indexOf(plugin) >= 0) {
					//logInitializations('Deleteing modules not needed for cli operations')
					delete this.ESM.Esm[plugin];
				}
			}
		}
	} else {
		isPush = false;
		if (IO) delete this.ESM.Esm.IO;
		delete IO.IO;
		IO = null;
	}
	delete this.ESM.Esm.Anziiloger;
	logInitializations(anziiloger);
	logInitializations(this.ESM.Esm);
	// let global = pao.pa_clone(this.ESM.Esm.Global)
	// delete this.ESM.Esm.Global
	libs.unshift(anziiloger);
	logInitializations("THE CORE", libs);

	libs.push(this.ESM.Esm);
	isPush ? libs.push(IO) : "";
	// libs.push(global)
	libs.forEach((lib) => {
		for (let moco in lib) {
			logInitializations("Inside activate", moco);
			logInitializations("THE LIB MOCO", typeof lib[moco]);
			logInitializations(lib[moco]);
			let moduId = moco.toLowerCase();
			logInitializations(`Currently executing module: ${moco}`);
			let modInstId = moduId;
			//logInitializations('Executing module without view')
			core.createModule(
				new lib[moco](pao.create(moduId, null, moco)),
				moduId,
				modInstId,
				moco,
			);
			//logInitializations(`Currently starting module: ${moco}`)
			core.startModule(moduId, modInstId);
			//logInitializations('Dependicies')
			//logInitializations(typeof this.ANDZIIY.core)
			// let moduId = mod.name.toLowerCase();
		}
	});
};
