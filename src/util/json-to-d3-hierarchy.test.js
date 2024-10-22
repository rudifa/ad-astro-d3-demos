import { expect, test } from "vitest";
import { convertToHierarchy } from "./json-to-d3-hierarchy"; // func under test
import { readJsonFile } from "./readJsonFile.js";

import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../../"); // w.r.t this test file

const jsonOneChild = {
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

const expectedOneChild = {
  name: "Ancestors",
  children: [
    {
      name: "Tom Johnson",
      children: [
        {
          name: "Alice Johnson",
          children: [],
        },
        {
          name: "Bob Johnson",
          children: [],
        },
      ],
    },
    {
      name: "Mary Williams",
      children: [
        {
          name: "Alice Johnson",
          children: [],
        },
        {
          name: "Bob Johnson",
          children: [],
        },
      ],
    },
  ],
};

// Test the convertToHierarchy function with in-file data
test("convertToHierarchy converts local data with one child", () => {
  const result = convertToHierarchy(jsonOneChild);

  expect(result).toEqual(expectedOneChild);
});

// Test the convertToHierarchy function with external data
test("convertToHierarchy converts file data with one child", async () => {
  console.log("process.cwd():", process.cwd());
  // Read input dataconst dataPath = path.join(PROJECT_ROOT, 'src', 'data', 'one-child.json');
  const dataPath = path.join(PROJECT_ROOT, "src", "data", "one-child.json");
  const data = await readJsonFile(dataPath);

  // Check if the imported data is an object
  if (typeof data === "object" && data !== null) {
    const dataSize = Object.keys(data).length;

    // Check if the data has the expected properties
    expect(dataSize).toBeLessThanOrEqual(2);
    expect(data).toHaveProperty("persons");
    expect(Array.isArray(data.persons)).toBe(true);
    expect(data.persons.length).toBeGreaterThan(0);
  } else {
    throw new Error("Imported data is not an object");
  }

  // Convert the data to a hierarchy and check properties
  const result = convertToHierarchy(data);
  expect(result).toHaveProperty("name", "Ancestors");
  expect(result.children).toBeInstanceOf(Array);
  expect(result.children.length).toBeGreaterThan(0);

  // Check the result of the conversion
  expect(result).toEqual(expectedOneChild);
});
