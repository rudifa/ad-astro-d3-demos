#! /usr/bin/env node

import * as d3 from "d3";
import { promises as fs } from "fs";
import { XMLSerializer } from "xmldom";


// Function to create a multi-parent family tree and generate SVG
function multiarchy(data) {
  // Dimensions for the SVG
  const width = 800;
  const height = 600;

  // Create a root hierarchy from the data
  const root = d3.hierarchy(data);

  // Create the SVG container
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f9f9f9");

  // Create a tree layout generator
  const treeLayout = d3.tree().size([width - 100, height - 100]);
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

// Sample data

const sampleFamilyData = {
  name: "Tom Johnson", // Root person
  children: [
    {
      name: "Alice Johnson",
      children: [], // Alice has no children in this example
    },
    {
      name: "Bob Johnson",
      children: [], // Bob has no children in this example
    },
  ],
};



let svgNode = multiarchy(sampleFamilyData);

// write the SVG to a file
const serializer = new XMLSerializer();
const svgString = serializer.serializeToString(svgNode);

fs.writeFile("family-tree.svg", svgString)
  .then(() => console.log("SVG file has been saved as family-tree.svg"))
  .catch((err) => console.error("Error writing SVG file:", err));
