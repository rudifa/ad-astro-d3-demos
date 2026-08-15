#! /usr/bin/env node

/**
 * Demonstrate how to use D3.js to create a hierarchical tree layout
 */

/**
rudifa
could you create an example of code (a class?) that works like the builder()?

d3dag-demo.js
:24-57
GitHub Copilot
Sure, I can create a simplified example of a class that works similarly to the builder() function from the d3dag library. This example will demonstrate how to build a graph with nodes and links.

Here's a basic implementation:
 */

class Graph {
  constructor() {
    this._nodes = new Map();
    this._links = [];
  }

  addNode(id, data = {}) {
    if (!this._nodes.has(id)) {
      this._nodes.set(id, { id, data, x: 0, y: 0 });
    }
    return this;
  }

  addLink(sourceId, targetId) {
    const source = this._nodes.get(sourceId);
    const target = this._nodes.get(targetId);
    if (source && target) {
      this._links.push({ source, target });
    }
    return this;
  }

  nodes() {
    return Array.from(this._nodes.values());
  }

  links() {
    return this._links;
  }
}

class GraphBuilder {
  constructor() {
    this.graph = new Graph();
  }

  addEdge(source, target) {
    this.graph.addNode(source).addNode(target).addLink(source, target);
    return this;
  }

  build() {
    return this.graph;
  }
}

// Usage example
const builder = new GraphBuilder();
const graph = builder.addEdge("a", "b").addEdge("b", "c").build();

console.log("Nodes:");
for (const node of graph.nodes()) {
  console.log("node data:", node.data, "x:", node.x, "y:", node.y);
}

console.log("Links:");
for (const link of graph.links()) {
  console.log("link source:", link.source.id, "target:", link.target.id);
}

console.log("Graph prototype:", Object.getPrototypeOf(graph));

/**
 *
 * In this example:

The Graph class manages nodes and links.
The GraphBuilder class provides a fluent interface to add edges and build the graph.
The addEdge method adds nodes and links to the graph.
The build method returns the constructed graph.
This is a simplified version and does not include all the features of the d3dag library,
but it demonstrates the basic concept of building a graph using a builder pattern.

 */
