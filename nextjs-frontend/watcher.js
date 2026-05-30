/* eslint-disable @typescript-eslint/no-require-imports */
const chokidar = require("chokidar");
const { exec } = require("child_process");
const { config } = require("dotenv");

config({ path: ".env.development" });

const openapiFile = process.env.OPENAPI_OUTPUT_FILE;

console.log("Watcher started");
console.log("Watching file:", openapiFile);

// Watch the specific file for changes
chokidar.watch(openapiFile).on("change", (path) => {
  console.log(`File ${path} has been modified. Running generate-client...`);
  exec("pnpm run generate-client", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
