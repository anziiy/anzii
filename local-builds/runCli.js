import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import createTarball from "./createTarball.js";
import npmPublish from "./npmPublish.js";
import parseScriptArguments from "./parseScriptArguments.js";
import publishYalcPackage from "./publishYalcPackage.js";
import runNpmScript from "./runNpmScript.js";

const dependecies = ["cjs-demo", "mjs-demo"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const thisFolder = __dirname;
console.log("scripts path", thisFolder);
const contextScriptRoot = path.resolve(thisFolder, "..");
console.log("THE SCRIPTS PATH", contextScriptRoot);
console.log("PROCESS ARG", parseScriptArguments());
//const workingDir = process.cwd();
const possibleArgs = parseScriptArguments();
if (possibleArgs.length === 0) {
	throw new Error("RUNCLI requires atleast one required script type to run");
}
const operationToRun = possibleArgs[0];

const packagesPath = path.join(contextScriptRoot, "packages");

if (operationToRun === "tarball") {
	if (possibleArgs.length === 1) {
		throw new Error("RUNCLI requires a package name to be tarballed");
	}
	const tarballPackageName = possibleArgs[1];
	const install = possibleArgs[2];
	const shouldInstallOnDeps = install && install === "install" ? true : false;
	const toBeTarballedPath = path.join(packagesPath, tarballPackageName);
	const madeTarball = createTarball(toBeTarballedPath, tarballPackageName);
	if (shouldInstallOnDeps) {
		chalk.green.bold(
			console.info("A tarball package of anzii has successfully been created"),
		);
		chalk.green.bold(
			console.info("System will install tarball package on dependecies next"),
		);
		dependecies.forEach(async (dep) => {
			let packagePath = `${path.join(
				process.cwd(),
				`packages/${dep}/package.json`,
			)}`;
			let packageJSON = JSON.parse(
				fs.readFileSync(packagePath, { encoding: "utf-8" }),
			);

			let packageJSONScripts = packageJSON.scripts;

			packageJSONScripts = {
				...packageJSONScripts,
				installTarball: `npm i file:../anzii/${madeTarball}`,
			};

			packageJSON = { ...packageJSON, scripts: { ...packageJSONScripts } };
			fs.writeFileSync(`${packagePath}`, JSON.stringify(packageJSON, null, 2));
			let runResult = await runNpmScript(
				"run",
				`--prefix ${path.join(
					process.cwd(),
					`packages/${dep}`,
				)} installTarball`,
				"",
				process.cwd(),
			);
			if (runResult) {
				chalk.cyanBright.bold(
					console.info(
						`Tarball package has successfully been installed on package ${dep}`,
					),
				);
			} else {
				chalk.redBright.bold(
					console.info(
						"Tarball package could not be installed. An error occured:",
						runResult,
					),
				);
			}
		});
		console.log("madeTARBALL", madeTarball);
	}
} else if (operationToRun === "publish") {
	publishYalcPackage("anzii")
		.then((publishResult) => {
			console.log("PUSH RESULT", publishResult);
			dependecies.forEach(async (dep) => {
				let runResult = await runNpmScript(
					"run",
					`--prefix ${path.join(process.cwd(), `packages/${dep}`)} yalc:add`,
					"",
					process.cwd(),
				);
				if (runResult) {
					chalk.cyanBright.bold(
						console.info(
							`Yalc added package has successfully been installed on package ${dep}`,
						),
					);
				} else {
					chalk.redBright.bold(
						console.info(
							"Yalc add package could not be installed. An error occured:",
							runResult,
						),
					);
				}
			});
		})
		.catch((err) => {
			console.log(
				"An error occured trying to perform publish/add operations",
				err,
			);
		});
} else if (operationToRun === "copubin") {
	runNpmScript(
		"run",
		`--prefix ${path.join(process.cwd(), `packages/anzii`)} compile`,
		"",
		process.cwd(),
	).then((result) => {
		if (result) {
			runNpmScript(
				"run",
				`--prefix ${process.cwd()} local:publish`,
				"",
				process.cwd(),
			).then((localPublishRes) => {
				if (localPublishRes) {
					console.log(
						"Anzii Package has succesfully been published and updated",
					);
					console.log(
						"Anzii dependent packages have been updated with the latest version",
					);
				}
			});
		}
	});
} else if (operationToRun === "npmPublish") {
	if (possibleArgs.length === 1) {
		throw new Error("RUNCLI requires a package name to be published");
	}
	if (possibleArgs.length < 4) {
		throw new Error("RUNCLI requires atleast 2 publish commands");
	}
	const publishPackageName = possibleArgs[1];
	let versionCommand = `${possibleArgs[2]} ${possibleArgs[3]}`;

	// const install = possibleArgs[2];
	// const shouldInstallOnDeps = install && install === "install" ? true : false;
	const toBePublishedPath = path.join(packagesPath, publishPackageName);
	let context = { context: toBePublishedPath, publishPackageName };
	let operations = [1];

	if (possibleArgs.length > 4) {
		operations.push(2);
	}
	console.log("THE OPERATIONS", operations);
	operations.forEach((op, i) => {
		let comm = i == 0 ? versionCommand : possibleArgs[4];
		console.log("THE COMM", comm);
		npmPublish({
			...context,
			publishCommand: comm,
		});
	});
}

// const nodeScriptPath = path.join(packagesPath, "kotii-cli");
// runNodeScript(
// 	nodeScriptPath,
// 	"app.js",
// 	contextScriptRoot,
// 	[parseScriptArguments(), madeTarball, parseContextArguments()],
// 	path.join(toBeTarballedPath, madeTarball),
// );
// console.log("Made TARBALL", madeTarball);
// console.log("CONTEXT ARGUMENTS", parseContextArguments());
// console.log("WORKING DIR", process.cwd());
// console.log("path_dirname", __dirname);
// console.log("path.join", path.join(__dirname, ".."));
// console.log("THE REAL PATH ", path.join(process.cwd()));
//createTarball();
