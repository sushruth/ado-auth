# Authenticator for ADO npm feeds

This is a monorepo containing following tools, plugins, and apps, that help authenticate `yarn` or `npm` to a private npm feed in Azure DevOps. 

This set of tools is aimed as a replacement for `vsts-npm-auth` with better developer expexperience.

## `ado-auth` 

This is a CLI tool that reads your local `.npmrc` and/or `.yarnrc.yml` files to check for any configured private registries and then fetches a token from Azure DevOps (opens a browser window for you to authorize this application the first time) and stores the token details in `~/.ado-authrc` file. When you run the tool again, it refreshes the token if its already expired. It works with `yarn` (v2+ as well), `npm` and `pnpm` too.
 
Check out the docs for more details here - [`ado-auth`](./packages/ado-auth/README.md)

## `yarn-ado-auth`

This is a Yarn 2+ plugin that automatically runs `ado-auth` before yarn looks up modules, so that the auth token available for yarn is always valid. Since yarn 2+ does not run `preinstall` before adding packages anymore, this plugin comes in handy.

Check out its README here - [`ado-auth`](./packages/yarn-ado-auth/README.md)

## `ado-auth-api`

This is ththe vercel application that helps `ado-auth` authenticate with Azure DevOps using their OAuth flow.

This is hosted at https://ado-auth.vercel.app