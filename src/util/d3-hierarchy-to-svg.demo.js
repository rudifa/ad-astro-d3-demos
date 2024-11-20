#! /usr/bin/env node

// from https://www.perplexity.ai/search/d3-hierarchy-does-it-run-only-KiVS5l4AS26ij4MQQqK5Ig

// d3.hierarchy: does it run only in browser, or can it also run in a node js program
// and enable creation of svg output to a file?
// can we have an example using es6?


import * as d3 from "d3";
import fs from "fs";

// Sample hierarchical data
const data = {
  name: "Root",
  children: [
    { name: "Child 1", value: 100 },
    {
      name: "Child 2",
      value: 200,
      children: [{ name: "Grandchild", value: 50 }],
    },
  ],
};

// Create hierarchy
const root = d3.hierarchy(data);

// Sum values
root.sum((d) => d.value);

// Create tree layout
const treeLayout = d3.tree().size([400, 200]);
treeLayout(root);

// Create SVG string
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300">
  <g>
    ${root
      .links()
      .map(
        (link) => `
      <line
        x1="${link.source.x}"
        y1="${link.source.y}"
        x2="${link.target.x}"
        y2="${link.target.y}"
        stroke="black"
      />
    `,
      )
      .join("")}
  </g>
  <g>
    ${root
      .descendants()
      .map(
        (node) => `
      <circle
        cx="${node.x}"
        cy="${node.y}"
        r="5"
        fill="blue"
      />
      <text
        x="${node.x + 10}"
        y="${node.y}"
        font-size="12"
      >${node.data.name}</text>
    `,
      )
      .join("")}
  </g>
</svg>
`;

// Save SVG to file
fs.writeFileSync("tree.svg", svgContent);

console.log("SVG file created: tree.svg");
