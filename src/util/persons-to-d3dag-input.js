 /**
 * Converts a flat JSON structure of persons with parent relationships into a d3dag input structure.
 *
 *
 * From:
{
  "persons": [
    {
      "name": "John Doe",
      "father": "Robert Doe",
      "mother": "Jane Smith"
    },
    {
      "name": "Jane Smith",
      "father": "Michael Smith",
      "mother": "Anna Johnson"
    },
    {
      "name": "Robert Doe",
      "father": "William Doe",
      "mother": "Sarah Miller"
    }
  ]
}
* To:
[
      { id: "John Doe", parentIds: ["Robert Doe","Jane Smith" "Jane Smith"] },
      { id: "Jane Smith", parentIds: ["Michael Smith", "Anna Johnson"] },
      { id: "Robert Doe", parentIds: ["William Doe", "Sarah Miller"] },
      { id: "William Doe", parentIds: [] },
      { id: "Sarah Miller", parentIds: [] },
      { id: "Michael Smith", parentIds: [] },
      { id: "Anna Johnson", parentIds: [] },
];
 *
 * @param {Object} data - The input data containing an array of persons with their parent relationships
 * @param {Array} data.persons - Array of person objects with name, father, and mother properties
 * @returns {Object} Array of nodes representing the persons and their parents
 */
export function personsToD3DagInput(data) {
  // Create a list to store all nodes with id == name and parents array
  const nodes = data.persons.map((person) => {
    const { name, father, mother, ...rest } = person;
    return {
      id: name,
      parentIds: [father, mother],
      ...rest // Copy any additional properties except name, father, and mother
    };
  });

  // Add nodes for parents if they don't exist in the nodes list
  // looking up all fathers and mothers and adding them to the nodes list
  const uniqueParents = new Set(
    data.persons.flatMap((person) => [person.father, person.mother])
  );

  uniqueParents.forEach((parent) => {
    if (!nodes.some((node) => node.id === parent)) {
      nodes.push({ id: parent, parentIds: [] });
    }
  });

  return nodes;
}
