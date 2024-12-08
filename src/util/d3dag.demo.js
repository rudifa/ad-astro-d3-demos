#! /usr/bin/env node

import {
  graphStratify,
  sugiyama,
  layeringLongestPath,
  decrossTwoLayer,
  coordCenter,
} from "d3-dag";

const FIXED_NODE_SIZE = 150; // pixels


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

function rund3dag(data) {
  // Create DAG from the data
  const dag = graphStratify()(data);

  console.log(
    "DAG:",
    JSON.stringify(
      dag,
      (key, value) => {
        if (typeof value === "function") {
          return value.toString();
        }
        return value;
      },
      2,
    ),
  );

  // Layout configuration
  const nodeSize = [FIXED_NODE_SIZE, FIXED_NODE_SIZE];

  // Sugiyama layout (specialized for DAGs)
  const layout = sugiyama()
    .nodeSize(nodeSize)
    .layering(layeringLongestPath())
    .decross(decrossTwoLayer())
    .coord(coordCenter());

  // Convert nodes and links to arrays
  const nodesArray = Array.from(dag.nodes());
  const linksArray = Array.from(dag.links());

  console.log("nodesArray:", nodesArray);
  console.log("linksArray:", linksArray);

  // Apply layout
  const layoutDag = layout(dag);

  console.log("layoutDag:", layoutDag);
}

rund3dag(twoChildren_d3dag);
