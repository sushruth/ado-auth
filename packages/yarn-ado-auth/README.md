# yarn-ado-auth

This is a yarn 3 plugin that works with `ado-auth` to make sure authentication is always run before package resolution.

## Installing plugin

```
yarn plugin import https://unpkg.com/yarn-ado-auth/bin/index.min.js
```

## Usage

Proceed to install packages with yarn as usual. Now ADO auth check happens every time there is an install. To find out more about [`ado-auth`](https://www.npmjs.com/package/ado-auth), check out [its `README` here](../../ado-auth/README.md)


## TODO 

- [ ] find out a way to stream logs to console from ado-auth
