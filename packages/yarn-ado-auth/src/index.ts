import type { Hooks, Plugin } from '@yarnpkg/core'

module.exports = {
  name: 'yarn-ado-auth',
  factory: (require: NodeRequire): Plugin => {
    let authRunPromise: Promise<void>

    const plugin: Plugin<Hooks> = {
      hooks: {
        async reduceDependency(dependency) {
          const { CLIENT_ID, DEFAULT_HOST, operate, SERVER_PORT } =
            await import('ado-auth')

          if (!authRunPromise) {
            console.log('Trying to authenticate to ado')

            authRunPromise = operate({
              clientId: CLIENT_ID,
              host: DEFAULT_HOST,
              port: SERVER_PORT,
              debug: true,
            })
          }

          await authRunPromise
          return dependency
        },
      },
    }

    return plugin
  },
}
