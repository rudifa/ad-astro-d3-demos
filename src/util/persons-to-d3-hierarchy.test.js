import { expect, test } from "vitest";
import { personsToHierarchyInput } from "./persons-to-d3-hierarchy"; // func under test
import { readJsonFile } from "./readJsonFile.js";

import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../../"); // w.r.t this test file

const twoChildren_persons = {
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

const twoChildren_d3hierarchy = {
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

// Test the personsToHierarchyInput function with in-file data
test("personsToHierarchyInput converts local data with twoChildren_persons", () => {
  const result = personsToHierarchyInput(twoChildren_persons);

  expect(result).toEqual(twoChildren_d3hierarchy);
});

// Test the personsToHierarchyInput function with external data
test("personsToHierarchyInput converts data from file two-children.json", async () => {
  console.log("process.cwd():", process.cwd());
  // Read input fom file 'two-children.json'
  const dataPath = path.join(PROJECT_ROOT, "src", "data", "two-children.json");
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
  const result = personsToHierarchyInput(data);
  expect(result).toHaveProperty("name", "Ancestors");
  expect(result.children).toBeInstanceOf(Array);
  expect(result.children.length).toBeGreaterThan(0);

  // Check the result of the conversion
  expect(result).toEqual(twoChildren_d3hierarchy);
});
