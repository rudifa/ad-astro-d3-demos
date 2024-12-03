/* eslint-env browser */

import { LitElement, html, css } from "lit";
import * as d3 from "d3";

import {
  graphStratify,
  sugiyama,
  layeringLongestPath,
  decrossTwoLayer,
  coordCenter,
} from "d3-dag";

console.log("d3 version:", d3.version);
console.log("d3-dag available:", !!graphStratify);

// Custom function to create a Bézier curve path
function createBezierPath(source, target) {
  const midY = (source.y + target.y) / 2;
  return `M${source.x},${source.y}
              C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`;
}



export class FamilyTreeVisualization extends LitElement {
  static properties = {
    familyData: {
      type: Array,
      attribute: "family-data",
      reflect: true,
      // converter: {
      //   fromAttribute: (value) => {
      //     try {
      //       return JSON.parse(value);
      //     } catch (error) {
      //       console.error("Invalid family data JSON", error);
      //       return [];
      //     }
      //   },
      // },
    },
    width: { type: Number, attribute: true },
    height: { type: Number, attribute: true },
    orientation: { type: String },

    testProp: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 400px; // Add this line
    }
    svg {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 600px;
    }

    sl-select {
      display: block;
      margin: 1rem;
      width: 12rem;
      background-color: #f0f8ff; /* Light blue background */
      color: #333; /* Dark text color */
    }
  `;

  constructor() {
    super();
    // Default data if none provided
    this.familyData = [
      { id: "Grandpa", parentIds: [] },
      { id: "Grandma", parentIds: [] },
      { id: "Parent1", parentIds: ["Grandpa", "Grandma"] },
      { id: "Parent2", parentIds: ["Grandpa", "Grandma"] },
      { id: "Child1", parentIds: ["Parent1"] },
      { id: "Child2", parentIds: ["Parent2"] },
    ];
    this.width = 800;
    this.height = 600;
    this.orientation = "top"; // Can be 'top', 'bottom', 'left', or 'right'
    this.testProp = "Initial value of testProp";
    console.log("Constructor called");
  }

  firstUpdated() {
    console.log("First updated");

    this.renderFamilyTree();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`Property ${propName} changed. Old value: ${oldValue}`);
    });

    // Your existing logic here
    if (changedProperties.has("familyData")) {
      this.renderFamilyTree();
    }
  }

  connectedCallback() {
    console.log("Connected callback");
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  renderFamilyTree() {
    try {
      console.log("Rendering family tree called");
      console.log("Family data:", this.familyData);
      console.log("Orientation:", this.orientation);

      if (!this.familyData || this.familyData.length === 0) {
        console.warn("No family data to render");
        return null;
      }

      // Create DAG from the data
      const dag = graphStratify()(this.familyData);

      console.log("DAG structure:", dag);

      // Layout configuration
      const margin = { top: 40, right: 40, bottom: 40, left: 40 };
      const nodeSize = [80, 80];

      // Sugiyama layout (specialized for DAGs)
      const layout = sugiyama()
        .nodeSize(nodeSize)
        .layering(layeringLongestPath())
        .decross(decrossTwoLayer())
        .coord(coordCenter());

      // Apply layout
      const { width, height } = layout(dag);

      // Get reference to dag nodes
      const nodes = dag.nodes();

      // Adjust node positions based on orientation
      this.adjustNodePositions(nodes, width, height);

      // Recalculate width and height after adjusting positions
      const xExtent = d3.extent(dag.nodes(), (node) => node.x);
      const yExtent = d3.extent(dag.nodes(), (node) => node.y);

      let newWidth = xExtent[1] - xExtent[0] + nodeSize[0];
      let newHeight = yExtent[1] - yExtent[0] + nodeSize[1];

      switch (this.orientation) {
        case "left":
        case "right":
          [newWidth, newHeight] = [newHeight, newWidth];
          break;
        default:
          break;
      }

      // Adjust SVG viewBox based on the new dimensions
      const [viewBoxWidth, viewBoxHeight] = [
        newWidth + margin.left + margin.right,
        newHeight + margin.top + margin.bottom,
      ];

      // Create SVG element using d3
      const svg = d3
        .create("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      console.log("SVG:", svg);
      console.log("G:", g);

      // Render box rect
      this.renderBoxRect(g, viewBoxWidth, viewBoxHeight);

      // Render links
      this.renderLinks(g, dag);

      // Render nodes
      this.renderNodes(g, dag);

      return svg;
    } catch (error) {
      console.error("Error rendering family tree:", error);
      return null;
    }
  }
 renderBoxRect(g, width, height) {
  const lines = [
    { x1: 0, y1: 0, x2: width, y2: 0 },
    { x1: 0, y1: 0, x2: 0, y2: height },
    { x1: 0, y1: height, x2: width, y2: height },
    { x1: width, y1: 0, x2: width, y2: height },
  ];

  g.selectAll("line")
    .data(lines)
    .enter()
    .append("line")
    .attr("x1", (d) => d.x1)
    .attr("y1", (d) => d.y1)
    .attr("x2", (d) => d.x2)
    .attr("y2", (d) => d.y2)
    .attr("stroke", "black")
    .attr("stroke-width", 1);
}
  adjustNodePositions(nodes, width, height) {
    switch (this.orientation) {
      case "bottom":
        nodes.forEach((node) => {
          node.y = height - node.y;
        });
        break;
      case "left":
        nodes.forEach((node) => {
          [node.x, node.y] = [node.y, node.x];
        });
        break;
      case "right":
        nodes.forEach((node) => {
          [node.x, node.y] = [node.y, node.x];
          node.x = width * 0.75 - node.x;
        });
        break;
      case "top":
      default:
        break;
    }
  }

  renderLinks(g, dag) {
    g.append("g")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", ({ source, target }) => createBezierPath(source, target))
      .attr("fill", "none")
      .attr("stroke", "#f19600")
      .attr("stroke-width", 2);
  }

  renderNodes(g, dag) {
    const nodeGroup = g
      .append("g")
      .selectAll("g")
      .data(dag.nodes())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodeGroup.append("circle").attr("r", 20).attr("fill", "#99b362");

    nodeGroup
      .append("text")
      .text((d) => d.data.id)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("font-size", "6px")
      .attr("fill", "white");
  }

  renderSelect() {
    return html`
      <sl-select
        label="Tree Orientation"
        value=${this.orientation}
        @sl-change=${(e) => (this.orientation = e.target.value)}
      >
        <sl-option value="top">Top to Bottom</sl-option>
        <sl-option value="bottom">Bottom to Top</sl-option>
        <sl-option value="left">Left to Right</sl-option>
        <sl-option value="right">Right to Left</sl-option>
      </sl-select>
    `;
  }

  render() {
    return html`
      ${this.renderSelect()}
      <div class="family-tree-container">${this.renderFamilyTree()}</div>
    `;
  }
}

// Define the custom element
customElements.define("family-tree-viz", FamilyTreeVisualization);
