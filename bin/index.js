#! /usr/bin/env node
import fs from "fs"
import path from "path"

// List of file types to check
const fileTypes = ['.js', '.ts', '.jsx', '.tsx']

const blacklisted = ["node_modules", ".yarn", ".pnp.cjs", ".pnp.loader.mjs"]

const envNotFound = {}

// Read .env file and store the key-value pairs in an object
const env = fs
    .readFileSync('.env', 'utf-8')
    .split('\n')
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .reduce((acc, curr) => {
        const [key, value] = curr.split('=')
        acc[key] = value
        return acc
    }, {})

// Function to check a file
const checkFile = (filePath) => {
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
        if (!env[envKey]) {
            envNotFound[envKey] = true
            process.exitCode = 1
        }
    })
}

const printMissingEnv = () => {
    Object.keys(envNotFound).forEach(env => {
        console.warn(`Warning: "${env}" is not specified in the .env file`)
    });
    console.warn("\n")
}

// Function to check all files in a directory
const checkDirectory = (dir) => {
    // Get a list of all files in the directory
    const files = fs.readdirSync(dir)

    // Iterate over the files
    for (const filename of files) {
        if (blacklisted.includes(filename)) {
            return;
        }
        // Get the full path of the file
        const filePath = path.join(dir, filename)
        // Check if the file is a directory
        if (fs.lstatSync(filePath).isDirectory()) {
            // If it's a directory, recursively check the files in it
            checkDirectory(filePath)
        } else {
            // Check if the file has a valid file type and is not blacklisted
            if (fileTypes.includes(path.extname(filename))) {
                // Check the file
                checkFile(filePath)
            }
        }
    }
}

checkDirectory(".")
printMissingEnv()