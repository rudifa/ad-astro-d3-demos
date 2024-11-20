#! /usr/bin/env node

import * as d3 from "d3";
import { JSDOM } from "jsdom";
import { promises as fs } from "fs";

import { createFamilyTree } from "./multiarchy-chatgpt.js";

function prepareDataForD3(node) {
  const { name, children } = node;
  return {
    name,
    children: children ? children.map(prepareDataForD3) : [],
  };
}

// Function to create a multi-parent family tree and generate SVG
function multiarchy(data, document) {
  console.log("Entering multiarchy function");
  console.log("Input data:", safeStringify(data));

  // Prepare data for D3
  const preparedData = prepareDataForD3(data);
  console.log("Prepared data:", safeStringify(preparedData));

  // Create a root hierarchy from the prepared data
  const root = d3.hierarchy(preparedData);
  console.log("Hierarchy root:", safeStringify(root));

  // Dimensions for the SVG
  const width = 800;
  const height = 600;

  // Create the SVG container
  const svg = d3
    .select(document.createElement("svg"))
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f9f9f9");

  // Create a tree layout generator
  const treeLayout = d3.tree().size([height, width - 100]);
  treeLayout(root);

  // Add links (lines) between nodes
  svg
    .selectAll("path.link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x),
    )
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1.5);

  // Add each node as a group
  const node = svg
    .selectAll("g.node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  // Add circles to each node
  node
    .append("circle")
    .attr("r", 5)
    .attr("fill", (d) => (d.children ? "#555" : "#999"));

  // Add labels to each node
  node
    .append("text")
    .attr("dy", 3)
    .attr("x", (d) => (d.children ? -8 : 8))
    .style("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name);

  // Return the SVG node as the output of the function
  return svg.node();
}

function safeStringify(obj, indent = 2) {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent,
  );
  cache = null;
  return retVal;
}

// Sample data

const personsObject = {
  persons: [
    { name: "Alice Johnson", father: "Tom Johnson", mother: "Mary Williams" },
    { name: "Bob Johnson", father: "Tom Johnson", mother: "Mary Williams" },
  ],
};

// Create a new JSDOM instance to simulate a browser environment
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const { document } = dom.window;

try {
  // Process the data
  const familyTreeData = createFamilyTree(personsObject);

  console.log("familyTreeData:", safeStringify(familyTreeData));

  // Call the function and append the SVG to the simulated body
  const svg = multiarchy(familyTreeData, document);
  document.body.appendChild(svg);

  // Output the SVG to a file
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
${dom.window.document.body.innerHTML}
</svg>`;

  fs.writeFile("out.svg", svgContent)
    .then(() => console.log("SVG file has been saved as out.svg"))
    .catch((error) => console.error("Error writing SVG file:", error));
} catch (error) {
  console.error("An error occurred:", error);
}
