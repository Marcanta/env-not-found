# env-not-found

Install with `npm install -g env-not-found`

## How it works

It searches all occurrences of "process.env.[value]" in your current dir ('.js', '.ts', '.jsx', '.tsx') and verifies if value is in the .env file.

## Usage

```
$ env-not-found --help
Usage:  env-not-found [options]

Verify if you have specified all environment variables in your env file

Options:
  -d, --project-root <string>  path to root folder (default: ".")
  -e, --env-file <string>      path to env file (default: ".env")
  -b, --blacklist <string...>  list of files to ignore (default: ["node_modules",".yarn",".pnp.cjs",".pnp.loader.mjs","dist"])
  -h, --help                   display help for command
```

If there are missing environment variables, the terminal output will be:
```
Warning: "COMMENT_WEBSOCKET_PORT" is not specified in the .env file
```
The program will then exit with a code of 1.

<br>

If all environment variables are present, nothing will be printed and the program will continue.

---
## .envignore
When you have default env from Node or React like TZ, PWD or npm_package_version. You can create a .envignore at the root path and fill it up with the env to ignore.