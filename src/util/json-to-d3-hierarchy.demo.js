#!/usr/local/bin/node

import { convertToHierarchy } from "./json-to-d3-hierarchy.js"; // func to demo
import { readJsonFile } from "../util/readJsonFile.js";

// Sample data
const sampleData = {
  persons: [
    {
      name: "Alice Johnson",
      father: "Tom Johnson",
      mother: "Mary Williams",
    },
    {
      name: "Bob Johnson",
      father: "Tom Johnson",
      mother: "Mary Williams",
    },
  ],
};

/**
 * Main function to demonstrate the usage of convertToHierarchy.
 * It processes sample data and reads from JSON files to create hierarchies.
 * The function showcases three scenarios:
 * 1. Converting a local JSON object
 * 2. Converting data from a file with one child
 * 3. Converting data from a file with two unrelated children
 * Each conversion is logged to the console for demonstration purposes.
 */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("Running main function: json-to-d3-hierarchy.js");
  console.log("Current directory:", process.cwd());
  console.log("Script directory:", __dirname);

  {
    // Convert from local json object
    const hierarchy = convertToHierarchy(sampleData);
    console.log("From sample data:", JSON.stringify(hierarchy, null, 2));
  }

  try {
    // Convert from a local file
    const file = resolve(__dirname, "../data/one-child.json");
    const data = await readJsonFile(file);
    const hierarchy = convertToHierarchy(data);
    console.log(`From local file ${file}:`, JSON.stringify(hierarchy, null, 2));
  } catch (error) {
    console.error("Error processing file:", error);
  }

  try {
    // Convert from another local file
    const file = resolve(__dirname, "../data/two-children-unrelated.json");
    const data = await readJsonFile(file);
    const hierarchy = convertToHierarchy(data);
    console.log(`From local file ${file}:`, JSON.stringify(hierarchy, null, 2));
  } catch (error) {
    console.error("Error processing file:", error);
  }
}

// Run the main function
main().catch((error) => console.error("Main function error:", error));
