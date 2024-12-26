import path from "path";
import runNpmScript from "./runNpmScript.js";

describe("Test CJS-DEMO Runs", () => {
	test("Should run cjs-demo start script successfully", async () => {
		expect(
			await runNpmScript(
				"run",
				`--prefix ${path.join(
					process.cwd(),
					"packages/cjs-demo",
				)} start:for:jest`,
				"",
				process.cwd(),
			),
		).toBeTruthy();
	}, 120000);
});
