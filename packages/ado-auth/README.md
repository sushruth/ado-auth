# ADO Authenticator

This package `ado-auth` aims to help in authenticating with Azure DevOps npm feeds. This supports `npm`, `yarn`, `pnpm` and `yarn2`.

This tool asks the user to authorize themselves with ADO and once accepted, creates two files, `.npmrc` and `.yarnrc.yml` to their respective specifications with the user's auth token.

[![npm version](https://badge.fury.io/js/ado-auth.svg)](https://badge.fury.io/js/ado-auth) [![Node.js Package](https://github.com/sushruth/ado-auth-cli/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sushruth/ado-auth-cli/actions/workflows/npm-publish.yml)

## How to use?

Simplest way is to run this -

```sh
npx ado-auth@latest
```

If that doesnt work (probably because your token is expired or token doesnt exist) use this -

```
npx ado-auth@latest --registry https://registry.npmjs.org/
```

## Options

### `--host`
> Default: `https://ado-auth.vercel.app`

You can install the [`ado-auth`](https://github.com/sushruth/ado-auth) web application (or something that behaves similarly at `api/auth` and `api/refresh` paths) on your own cloud for more security.

Use this option when you have a custom host for the web app.

### `-p`, `--port`
> Default: `35287`

Use this option to specify which port to listen on from the host.

### `-c`, `-clientid`

use this along with custom `--host` option to pass a different vistualstudio.com app client ID to use for authentication. This requires a custom host since the public host at [`ado-auth.vercel.app`](https://ado-auth.vercel.app) does not work with custom client ID.

### `-d`, `--debug`

This option enables some logging in the CLI to help identify any issues.

### `-v`, `--version`

Displays the current version of the application

### `-h`, `--help`

Displays the help information

