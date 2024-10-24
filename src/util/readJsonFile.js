import { promises as fs } from "fs";

/**
 * Reads a JSON file and returns its contents as a JavaScript object.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 * @throws {Error} If there's an error reading or parsing the file.
 */
export async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
}
