import path from "path";
import runNpmScript from "./runNpmScript.js";

describe("Test shell scripting semulation", () => {
	test("Should create webpack assets successfully for a given package", async () => {
		expect(
			await runNpmScript(
				"run",
				`--prefix ${path.join(process.cwd(), "packages/anzii")} compile`,
				"",
				process.cwd(),
			),
		).toBeTruthy();
	}, 60000);
});
