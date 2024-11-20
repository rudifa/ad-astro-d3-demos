export function createFamilyTree(input) {
  const nodes = new Map();

  // Determine if input is an array or an object with a persons property
  const persons = Array.isArray(input) ? input : input.persons;

  if (!Array.isArray(persons)) {
    throw new Error("Input must be an array of persons or an object with a persons array");
  }

  // Step 1: Initialize nodes in the map
  persons.forEach((person) => {
    if (!nodes.has(person.name)) {
      nodes.set(person.name, { name: person.name, children: [], parents: [] });
    }
  });

  // Step 2: Build parent-child relationships based on father and mother properties
  persons.forEach((person) => {
    const node = nodes.get(person.name);

    // Check if the father exists and add relationship
    if (person.father) {
      if (!nodes.has(person.father)) {
        nodes.set(person.father, {
          name: person.father,
          children: [],
          parents: [],
        });
      }
      const fatherNode = nodes.get(person.father);
      if (!fatherNode.children.includes(node)) {
        fatherNode.children.push(node);
      }
      if (!node.parents.includes(fatherNode)) {
        node.parents.push(fatherNode);
      }
    }

    // Check if the mother exists and add relationship
    if (person.mother) {
      if (!nodes.has(person.mother)) {
        nodes.set(person.mother, {
          name: person.mother,
          children: [],
          parents: [],
        });
      }
      const motherNode = nodes.get(person.mother);
      if (!motherNode.children.includes(node)) {
        motherNode.children.push(node);
      }
      if (!node.parents.includes(motherNode)) {
        node.parents.push(motherNode);
      }
    }
  });

  // Step 3: Identify root nodes (those with no parents)
  const rootNodes = Array.from(nodes.values()).filter(
    (node) => node.parents.length === 0
  );

  // Return a single root node or an array of root nodes if there are multiple roots
  return rootNodes.length === 1 ? rootNodes[0] : rootNodes;
}
