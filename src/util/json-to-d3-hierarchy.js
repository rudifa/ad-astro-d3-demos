
export function convertToHierarchy(data) {
  // Create a map to store all nodes by name
  const nodesMap = new Map();

  // Function to get or create a node
  const getNode = (name) => {
    if (!name) return null;
    if (!nodesMap.has(name)) {
      nodesMap.set(name, { name, children: [] });
    }
    return nodesMap.get(name);
  };

  // Iterate over all persons
  data.persons.forEach((person) => {
    const personNode = getNode(person.name);
    const fatherNode = getNode(person.father);
    const motherNode = getNode(person.mother);

    // Add the current person as a child of both parents
    if (fatherNode && person.father) fatherNode.children.push(personNode);
    if (motherNode && person.mother) motherNode.children.push(personNode);
  });

  // Now find all root nodes (nodes without parents)
  const roots = Array.from(nodesMap.values()).filter((node) => {
    return !data.persons.some(
      (person) => person.name === node.name && (person.father || person.mother),
    );
  });

  // Return the final hierarchy structure with a root node
  return {
    name: "Ancestors",
    children: roots,
  };
}
