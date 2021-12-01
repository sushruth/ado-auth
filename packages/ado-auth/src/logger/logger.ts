import { dim } from 'kleur/colors'
import Spin from 'light-spinner'
import { PrefixedSpinner, PrefixedSpinnerOptions } from '../lib/spinner'

class Logger {
  debugEnabled = false
  debugPrefix = dim('[ado-auth]')

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

  private _spinner: Spin | undefined

  newSpinner(options: PrefixedSpinnerOptions) {
    this._spinner = new PrefixedSpinner(options)
  }

  spinner = {
    new: (options: PrefixedSpinnerOptions) => {
      if (this.debugEnabled) {
        this._spinner?.stop()
        this._spinner = new PrefixedSpinner(options)
        this._spinner.start()
      }
    },

    start: () => {
      if (this.debugEnabled) {
        this._spinner?.start()
      }
    },

    succeed: (text?: string) => {
      if (this.debugEnabled) {
        this.debug(`\n✅ ${text || this._spinner?.text}`)
        this._spinner?.stop()
      }
    },

    fail: (text?: string) => {
      if (this.debugEnabled) {
        this.debug(`\n❌ ${text || this._spinner?.text}`)
        this._spinner?.stop()
      }
    },
  }
}

export const logger = new Logger()
