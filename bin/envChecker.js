import fs from "fs"
import path from "path"

export default class EnvChecker {
    // List of file types to check
    fileTypes = ['.js', '.ts', '.jsx', '.tsx']

    envNotFound = {}

    envToIgnore = []

    constructor(envPath, blacklisted) {
        // Read .env file and store the key-value pairs in an object
        this.env = fs
        .readFileSync(envPath, 'utf-8')
        .split('\n')
        .filter((line) => line.length > 0 && !line.startsWith('#'))
        .reduce((acc, curr) => {
            const [key, value] = curr.split('=')
            acc[key] = value
            return acc
        }, {})
        this.blacklisted = blacklisted
    }

    setEnvToIgnore = (envIgnorePath) => {
        if (fs.existsSync(envIgnorePath)) {
            this.envToIgnore = fs
            .readFileSync(envIgnorePath, 'utf-8')
            .split('\n')
            .filter((line) => line.length > 0 && !line.startsWith('#'))
        }
    }

    // Function to check a file
    _checkFile = (filePath) => {
        // Read the file
        const fileContent = fs.readFileSync(filePath, 'utf-8')

        // Find all occurrences of `process.env.<value>`
        const envMatches = fileContent.match(/process\.env\.[A-Z0-9_]+/gi)

        // If there are no matches, return
        if (!envMatches) {
            return
        }

        // Iterate over the matches
        envMatches.forEach((match) => {
            // Extract the <value> part
            const envKey = match.split('.')[2]

            // Check if the key is specified in the .env file
            if (!this.env[envKey] && !this.envToIgnore.includes(envKey)) {
                this.envNotFound[envKey] = true
                process.exitCode = 1
            }
        })
    }

    printMissingEnv = () => {
        Object.keys(this.envNotFound).forEach(env => {
            console.warn(`Warning: "${env}" is not specified in the .env file`)
        });
        console.warn("\n")
    }

    // Function to check all files in a directory
    checkDirectory = (dir) => {
        this.setEnvToIgnore(`${dir}/.envignore`)
        // Get a list of all files in the directory
        const files = fs.readdirSync(dir)

        // Iterate over the files
        for (const filename of files) {
            if (this.blacklisted.includes(filename)) {
                continue;
            }
            // Get the full path of the file
            const filePath = path.join(dir, filename)
            // Check if the file is a directory
            if (fs.lstatSync(filePath).isDirectory()) {
                // If it's a directory, recursively check the files in it
                this.checkDirectory(filePath)
            } else {
                // Check if the file has a valid file type and is not blacklisted
                if (this.fileTypes.includes(path.extname(filename))) {
                    // Check the file
                    this._checkFile(filePath)
                }
            }
        }
    }
}