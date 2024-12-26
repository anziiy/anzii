import path from "path";
import runNpmScript from "./runNpmScript.js";

describe("Test MJS-DEMO Runs", () => {
	test("Should run mjs-demo start script successfully", async () => {
		expect(
			await runNpmScript(
				"run",
				`--prefix ${path.join(
					process.cwd(),
					"packages/mjs-demo",
				)} start:for:jest`,
				"",
				process.cwd(),
			),
		).toBeTruthy();
	}, 120000);
});
