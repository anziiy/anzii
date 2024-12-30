import childProcess from "child_process";
export default function (publishOptions = {}) {
	const { context = "", publishCommand = "" } = publishOptions;
	if (!publishCommand.trim())
		throw new Error("Npm publish operation requires publish command typ");

	let commandToRun = `npm ${publishCommand}`;
	let currentWorkingDirectory = context ? context : process.cwd();
	let createdPath = childProcess
		.execSync(`${commandToRun}`, {
			cwd: `${currentWorkingDirectory}`,
		})
		.toString()
		.trim();
	console.log(
		`NPM Publish command's ${publishCommand} has completed:, ${createdPath}`,
	);
	return createdPath;
}
