import chalk from "chalk";
import { exec } from "child_process";
export default function (
	npmCommand = "run",
	scriptToRun = "tarball",
	options = "",
	cwd = process.cwd(),
) {
	return new Promise((resolve, reject) => {
		let terminalOptions =
			options instanceof Array ? options.join(" ") : options.trim();
		let commandToRun = `npm ${npmCommand} ${scriptToRun} ${terminalOptions}`;
		console.log("command to run", commandToRun);
		exec(`${commandToRun}`, { cwd: cwd }, (err) => {
			if (err)
				console.log(chalk.redBright.bold("Npm script failed with error:"), err);
			if (err) reject(false);
			console.log(chalk.bgGreen.bold("Npm script ran successfully"));
			resolve(true);
		});
	});
}
