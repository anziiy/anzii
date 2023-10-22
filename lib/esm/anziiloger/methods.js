/* eslint-disable no-unused-vars */
export const init = function () {
    this.setDebugger(this.constructor.name);
    //   this.handleAnziilogerConfig()
    //this.aLog({message: 'Anziilger has been initialised'})  
    this.listens({
        'config-anziiloger': this.handleAnziilogerConfig.bind(this),
        'anziiloger-log': this.handleLogRequest.bind(this)
    });
};
export const handleLogRequest = function (data) {
    const self = this;
    const pao = self.pao;
    const cliLogsSet = process.env.SHOW_ANZII_CLI_LOGS || 'false';
    const shouldShowCliLogs = cliLogsSet === "true" ? true : false;
    // self.pao.pa_wiLog('HANDLELOGREQUEST')
    // self.pao.pa_wiLog(data)
    // self.pao.pa_wiLog(data.source) 
    if (pao.PROMPT.indexOf('cli') >= 0 && shouldShowCliLogs === false)
        return;
    if (self.logger) {
        switch (data.type) {
            case 'info':
                self.info(data);
                break;
            case 'warn':
                self.warn(data);
                break;
            case 'error':
                self.error(data);
                break;
            case 'adLog':
                self.aLog(data);
                break;
            case 'wiLog':
                self.iLog(data);
                break;
            default: self.debug(data);
        }
    }
    else {
        console.log(data.source, 'logged message: ', data.message, ' of type ', data.type);
    }
};
export const handleAnziilogerConfig = function (data) {
    const self = this;
    // self.pao.pa_wiLog('THE DEUGAS')
    // self.pao.pa_wiLog(self.debugas)
    const pao = self.pao;
    // self.logger = data
    // self.info({message: "Anzii is configuring logger",sync: true,source: 'Anziiloger'})
    // self.pao.pa_wiLog('ANZII LOGGER IS CATCHING AN EVENT FROM CONFIG')
    // self.pao.pa_wiLog(data)
    // data.hasOwnProperty('transports')
    //   ? pao.pa_isArray(data.transports) 
    // 	 ? self.defaultTransports.concat(data.transports)
    // 	 : console.log('Config: invalid def..  ')
    //   :''
    let now = new Date();
    self.logger = new self.winlo.createLogger({
        transports: [
            // new  self.winlo.transports.File(
            // 	{
            // 	name: 'production',
            // 	level: 'info', 
            // 	filename: './logs/production.log',
            // 	handleExceptions: true, 
            // 	json: true,
            // 	label: 'Anzilloger',
            // 	maxsize: 5242880,
            // 	maxFiles: 5,
            // 	timestamp: now,
            // 	colorize: false}
            // ),
            // new  self.winlo.transports.File(
            // 	{
            // 	name: 'errors',
            // 	level: 'error', 
            // 	filename: './logs/errors.log',
            // 	handleExceptions: true, 
            // 	json: true,
            // 	label: 'Anzilloger',
            // 	maxsize: 5242880,
            // 	maxFiles: 5,
            // 	timestamp: true,
            // 	colorize: false}
            // ),
            new self.winlo.transports.Console({
                level: 'debug',
                label: 'Anzilloger',
                timestamp: true,
                colorize: true
            }),
            new self.winlo.transports.Console({
                level: 'info',
                label: 'Anzilloger',
                timestamp: true,
                colorize: true
            }),
            new self.winlo.transports.Console({
                level: 'warn',
                label: 'Anzilloger',
                timestamp: true,
                colorize: true
            }), new self.winlo.transports.Console({
                level: 'error',
                label: 'Anzilloger',
                timestamp: true,
                colorize: true
            })
        ]
    });
};
export const info = async function (log) {
    const self = this;
    const pao = self.pao;
    const contains = pao.pa_contains;
    // if(contains(log,'sync')){
    // 	await self.logger.info(`${log.source}: ${log.message}`)
    // }else{
    // 	self.logger.info(`${log.source}: ${log.message}`)
    // }
    if (contains(log, 'sync')) {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
            // self.pao.pa_wiLog(self.debugas)
            self.iLog({ message: 'Logging info sync with debugas' });
            self.iLog({ message: log.message });
            self.iLog({ message: self.debugas[log.source.toLowerCase()] });
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            !self.debugas[log.source.toLowerCase()].enabled && process.env.NODE_ENV.toLowerCase() === 'production' ? self.debugas[log.source.toLowerCase()].enabled = true : '';
            await self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            try {
                self.iLog({ message: 'Logging info sync' });
                self.iLog({ message: log.source });
                self.iLog({ message: log.message });
                await self.logger.debug(`${log.source}: ${log.message}`);
            }
            catch (e) {
                self.iLog({ message: 'Logging info::WITH ERROR' });
                // self.iLog(e)
                console.log(e);
            }
        }
    }
    else {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
            // self.pao.pa_wiLog(self.debugas)
            // console.log('debugs has property',log.source)
            self.iLog({ message: 'Logging info sync with debugas::NONESYNC' });
            self.iLog({ message: self.debugas[log.source.toLowerCase()] });
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            try {
                self.iLog({ message: 'Logging info sync::noneSync' });
                self.iLog({ message: log.source });
                self.logger.debug(`${log.source}: ${log.message}`);
            }
            catch (e) {
                self.iLog({ message: 'Logging infoNONESYNC::WITH ERROR' });
                console.log(e);
            }
            // self.logger.debug(`${log.source}: ${log.message}`)
        }
    }
    // if(self.debugas.hasOwnProperty(log.source.toLowerCase())){
    // 	// self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
    // 	// self.pao.pa_wiLog(self.debugas)
    // 	await self.debugas[log.source.toLowerCase()](log.message)
    // }else{
    // 	await self.logger.info(`${log.source}: ${log.message}`)
    // }
    // self.log('THE INFO METHOD RECEIVES A CALL')
    // self.log(log) 
};
export const debug = async function (log) {
    const self = this;
    const pao = self.pao;
    const contains = pao.pa_contains;
    if (contains(log, 'sync')) {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
            // self.pao.pa_wiLog(self.debugas)
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            await self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            await self.logger.debug(`${log.source}: ${log.message}`);
        }
    }
    else {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
            // self.pao.pa_wiLog(self.debugas)
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            self.logger.debug(`${log.source}: ${log.message}`);
        }
    }
};
export const warn = async function (log) {
    //const self = this 
    //self.logger.warn(`${log.source}: ${log.message}`)
    const self = this;
    const pao = self.pao;
    const contains = pao.pa_contains;
    // if(contains(log,'sync')){
    // 	await self.logger.warn(`${log.source}: ${log.message}`)
    // }else{
    // 	self.logger.warn(`${log.source}: ${log.message}`)
    // }
    if (contains(log, 'sync')) {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED')
            // self.pao.pa_wiLog(self.debugas)
            self.iLog({ message: 'Logging warn sync with debugas' });
            self.iLog(self.debugas[log.source.toLowerCase()]);
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            await self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            self.iLog({ message: 'Logging warn sync' });
            self.iLog({ message: log.source });
            await self.logger.warn(`${log.source}: ${log.message}`);
        }
    }
    else {
        if (self.debugas.hasOwnProperty(log.source.toLowerCase())) {
            // self.pao.pa_wiLog('THE DEBUG MODULE IS USED'})
            // self.pao.pa_wiLog(self.debugas)
            self.iLog({ message: 'Logging warn sync with debugas:NONESYNC' });
            self.iLog({ message: self.debugas[log.source.toLowerCase()] });
            !self.debugas[log.source.toLowerCase()].useColors ? self.debugas[log.source.toLowerCase()].useColors = true : '';
            self.debugas[log.source.toLowerCase()](log.message);
        }
        else {
            self.iLog({ message: 'Logging warn NONESYNC' });
            self.iLog({ message: log.source });
            self.logger.warn(`${log.source}: ${log.message}`);
        }
    }
};
export const error = async function (log) {
    //const self = this 
    //self.logger.error(`${log.source}: ${log.message}`)  
    const self = this;
    const pao = self.pao;
    const contains = pao.pa_contains;
    if (contains(log, 'sync')) {
        await self.logger.error(`${log.source}: ${log.message}`);
    }
    else {
        self.logger.error(`${log.source}: ${log.message}`);
    }
};
export const aLog = async function (log) {
    const self = this;
    //self.logger.error(`${log.source}: ${log.message}`) 
    // self.pao.pa_wiLog(process.env)
    // if(process.env.SHOW_ANZII_DEBUG_LOGS && process.env.SHOW_ANZII_DEBUG_LOGS.trim().toLowerCase() === 'true') console.log(log.message) 
    if (!process.env.SHOW_ANZII_DEBUG_LOGS)
        return;
    if (process.env.SHOW_ANZII_DEBUG_LOGS.trim().toLowerCase() !== 'true')
        return;
    self.pao.pa_wiLog('aLog:ANZIILOGER');
    self.pao.pa_wiLog(process.env.SHOW_ANZII_DEBUG_LOGS);
    console.log(log.message);
    // const self = this 
    // const pao = self.pao 
    // const contains = pao.pa_contains 
};
export const iLog = async function (log) {
    const self = this;
    //self.logger.error(`${log.source}: ${log.message}`) 
    // self.pao.pa_wiLog(process.env)
    // if(process.env.SHOW_ANZII_DEBUG_LOGS && process.env.SHOW_ANZII_DEBUG_LOGS.trim().toLowerCase() === 'true') console.log(log.message) 
    if (!process.env.SHOW_ANZII_WI_LOGS)
        return;
    if (process.env.SHOW_ANZII_WI_LOGS.trim().toLowerCase() !== 'true')
        return;
    self.pao.pa_wiLog('iLog:ANZIILOGER');
    self.pao.pa_wiLog(process.env.SHOW_ANZII_WI_LOGS);
    console.log(log.message);
    // const self = this 
    // const pao = self.pao 
    // const contains = pao.pa_contains 
};
export const setDebugger = async function (mod) {
    const self = this;
    let name = mod.toLowerCase();
    // self.pao.pa_wiLog('THE CURRETN MODULE IN ANZILOGGER')
    // self.pao.pa_wiLog(mod)
    self.debugas[name] = self.debugr(`anzii:${name}`);
};
