import debug from "debug";
export const logInitializations = function (...messageArgs) {
	let initializationLogging = process.env.ANZII_SHOW_INITIALIZATIONS || "false";
	let shouldLog =
		initializationLogging && initializationLogging === "true" ? true : false;
	if (!shouldLog) return;
	let debugLog = debug("anzii:initializations");
	debugLog(`Initializing Anzii:`, ...messageArgs);
};
