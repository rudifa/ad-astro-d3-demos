import { expect, test } from "vitest";
import { personsToD3DagInput } from "./persons-to-d3dag-input.js"; // func under test
import { readJsonFile } from "./readJsonFile.js";
import path from "path";

const logFlag = process.env.LOG !== "";

const PROJECT_ROOT = path.resolve(__dirname, "../../"); // w.r.t this test file

/**
 * Test personsToD3DagInput function
 */

// `persons` format
const twoChildren_persons = {
  persons: [
    {
      name: "Alice Johnson",
      father: "Tom Johnson",
      mother: "Mary Williams",
      age: 10,
    },
    {
      name: "Bob Johnson",
      father: "Tom Johnson",
      mother: "Mary Williams",
      age: 12,
    },
  ],
};

// d3dag-input format
const twoChildren_d3dag = [
  {
    id: "Alice Johnson",
    parentIds: ["Tom Johnson", "Mary Williams"],
    age: 10,
  },
  {
    id: "Bob Johnson",
    parentIds: ["Tom Johnson", "Mary Williams"],
    age: 12,
  },
  {
    id: "Tom Johnson",
    parentIds: [],
  },
  {
    id: "Mary Williams",
    parentIds: [],
  },
];

// Test the personsToHierarchyInput function with local data twoChildren_persons
test("personsToD3DagInput converts local data twoChildren_persons", () => {
  const result = personsToD3DagInput(twoChildren_persons);
  expect(result).toEqual(twoChildren_d3dag);
  if (logFlag) {
    console.log("Conversion result:", JSON.stringify(result, null, 2));
  }
});

// Test the personsToHierarchyInput function with external data
test("personsToD3DagInput converts data from file two-children.json", async () => {
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

  // Convert the data to d3dag format and check properties
  const result = personsToD3DagInput(data);
  expect(result).toBeInstanceOf(Array);
  expect(result.length).toEqual(4);

  // Check the result of the conversion
  expect(result).toEqual(twoChildren_d3dag);
});
