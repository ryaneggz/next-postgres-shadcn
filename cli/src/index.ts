#!/usr/bin/env node

/**
 * openharness — Open Harness CLI
 *
 * A custom Pi Agent CLI with sandbox management tools built-in.
 * Wraps Pi's main() and auto-loads sandbox tools as an extension.
 */

import { main } from "@mariozechner/pi-coding-agent";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-load the sandbox tools extension
const extensionPath = resolve(__dirname, "extension.js");

// Forward all CLI args, injecting our extension
const args = process.argv.slice(2);
args.push("--extension", extensionPath);

main(args).catch((err) => {
  console.error(err);
  process.exit(1);
});
