#! /usr/bin/env node
import EnvChecker from "./envChecker.js"
import { Command } from "commander"

const program = new Command();

program.command('env-not-found')
    .description('Verify if a you specified all env in your env file')
    .option("-d, --project-root <string>", "path to root folder", ".")
    .option("-e, --env-file <string>", "path to env file", ".env")
    .option("-b, --blacklist <string...>", "list of files to ignore", ["node_modules", ".yarn", ".pnp.cjs", ".pnp.loader.mjs", "dist"])
    .action(options => {
        console.log(options)
        const envChecker = new EnvChecker(options.envFile, options.blacklist)
        envChecker.checkDirectory(options.projectRoot)
        console.log(envChecker.envNotFound)
        envChecker.printMissingEnv()
    })
    .parse(process.argv)