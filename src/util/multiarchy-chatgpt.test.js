

// https://chatgpt.com/c/671eb23b-6e00-8010-ae9e-05bbb1541cf9


// function createFamilyTree(data) {
//   const nodes = new Map();

//   // Step 1: Initialize nodes in the map
//   data.forEach((person) => {
//     if (!nodes.has(person.name)) {
//       nodes.set(person.name, { name: person.name, children: [], parents: [] });
//     }
//   });

//   // Step 2: Build parent-child relationships
//   data.forEach((person) => {
//     const node = nodes.get(person.name);
//     (person.parents || []).forEach((parentName) => {
//       if (!nodes.has(parentName)) {
//         nodes.set(parentName, { name: parentName, children: [], parents: [] });
//       }
//       const parentNode = nodes.get(parentName);
//       // Avoid adding the same child multiple times
//       if (!parentNode.children.includes(node)) {
//         parentNode.children.push(node);
//       }
//       // Link back to parent in the child node
//       if (!node.parents.includes(parentNode)) {
//         node.parents.push(parentNode);
//       }
//     });
//   });

//   // Step 3: Identify root nodes (those with no parents)
//   const rootNodes = Array.from(nodes.values()).filter(
//     (node) => node.parents.length === 0,
//   );

//   // Return an array of root nodes or a single root node, depending on your structure
//   return rootNodes.length === 1 ? rootNodes[0] : rootNodes;
// }
