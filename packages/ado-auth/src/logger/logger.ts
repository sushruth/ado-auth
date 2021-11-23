import chalk from 'chalk'

class Logger {
	debugEnabled = false
	debugPrefix = chalk.gray('[ado-auth]')

	enableDebug = () => {
		this.debugEnabled = true
	}

	disableDebug = () => {
		this.debugEnabled = false
	}

	debug = (message?: unknown, ...optionalParams: unknown[]) => {
		if (this.debugEnabled) {
			console.debug(this.debugPrefix, message, ...optionalParams)
		}
	}
}

export const logger = new Logger()
