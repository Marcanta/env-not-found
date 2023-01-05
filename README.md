# env-not-found

Install with `npm install -g env-not-found`

## How it works

It searches all occurrences of "process.env.[value]" in your current dir ('.js', '.ts', '.jsx', '.tsx') and verifies if value is in the .env file.

## Usage

```
# env-not-found
```

If there are missing environment variables, the terminal output will be:
```
Warning: "COMMENT_WEBSOCKET_PORT" is not specified in the .env file
```
The program will then exit with a code of 1.

<br>

If all environment variables are present, nothing will be printed and the program will continue.
