#! /usr/bin/env node

// from https://erikbrinkman.github.io/d3-dag/modules.html

// import relevant functions in whatever way is necessary
import pkg from "d3-dag";
const { graphConnect, sugiyama } = pkg;

// import { graphConect, sugiyama } from "d3-dag";
const builder = graphConnect(); // optionally customize with fluent interface
const graph = builder([
  ["a", "b"],
  ["b", "c"],
]);
const layout = sugiyama(); // optionally customize with fluent interface
const { width, height } = layout(graph);

console.log("graph:", graph);
console.dir(graph, { depth: null, colors: true });

console.log("width:", width, "height:", height);

for (const node of graph.nodes()) {
  console.log("node   data:", node.data, "  x:", node.x, "  y:", node.y);
}

// Print nodes
const nodes = graph.nodes();
console.log("Nodes:");
for (const node of nodes) {
  console.log("node data:", node.data, "x:", node.x, "y:", node.y);
  console.log("typeof node:", typeof node);
}

// Print links
const links = graph.links();
console.log("Links:");
for (const link of links) {
  console.log("link source:", link.source.data, "target:", link.target.data);
  console.log("typeof link:", typeof link);
}

// Inspect the prototype of the graph object
const graphPrototype = Object.getPrototypeOf(graph);
console.log("Graph prototype:", graphPrototype);

const prototypeProperties = Object.getOwnPropertyNames(graphPrototype);
for (const key of prototypeProperties) {
  console.log(`Prototype property: ${key}`);
}

// Optionally, print out all properties of the graph object
for (const key in graph) {
  console.log(`key= ${key}`);
   if (Object.prototype.hasOwnProperty.call(graph, key)) {
     console.log(`${key}:`, graph[key]);
   }
}
