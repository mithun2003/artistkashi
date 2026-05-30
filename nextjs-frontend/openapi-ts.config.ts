import { defineConfig } from "@hey-api/openapi-ts";
import { config } from "dotenv";

config({ path: ".env.development" });

const openapiFile = process.env.OPENAPI_OUTPUT_FILE;

if (!openapiFile) {
  throw new Error("OPENAPI_OUTPUT_FILE is not defined");
}

export default defineConfig({
  input: openapiFile,
  output: {
    path: "src/api/openapi-client",
    postProcess: ["prettier"],
  },
  plugins: ["@hey-api/client-axios"],
});