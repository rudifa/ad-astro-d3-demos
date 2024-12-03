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

// console.log("d3 version:", d3.version);
// console.log("d3-dag available:", !!graphStratify);

// Custom function to create a Bézier curve path
function createBezierPath(source, target) {
  const midY = (source.y + target.y) / 2;
  return `M${source.x},${source.y}
              C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`;
}

const FIXED_NODE_SIZE = 150; // pixels
const FIXED_CIRCLE_RADIUS = 40; // pixels
const FIXED_FONT_SIZE = "16px"; // pixels

export class FamilyTreeVisualization extends LitElement {
  static properties = {
    familyData: {
      type: Array,
      attribute: "family-data",
      reflect: true,
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
    .family-tree-container {
      width: 100%;
      height: 600px; // Or any other fixed height
      overflow: auto;
      border: 1px solid #ccc; // Optional: adds a border around the scrollable area
    }
    svg {
      display: block;
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
    // console.log("Constructor called");
  }

  firstUpdated() {
    console.log("First updated");
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (
      changedProperties.has("familyData") ||
      changedProperties.has("orientation")
    ) {
      // Use requestAnimationFrame to ensure the DOM is ready
      requestAnimationFrame(() => {
        const placeholder = this.shadowRoot.getElementById(
          "family-tree-placeholder",
        );
        if (placeholder) {
          const svg = this.renderFamilyTree();
          if (svg) {
            placeholder.innerHTML = "";
            placeholder.appendChild(svg.node());
          }
        }
      });
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
    console.log("renderFamilyTree");

    if (typeof document === "undefined") {
      // Return a placeholder when running on the server
      return html`<div id="family-tree-placeholder"></div>`;
    }

    try {
      // console.log("Family data:", this.familyData);
      // console.log("Orientation:", this.orientation);

      if (!this.familyData || this.familyData.length === 0) {
        console.warn("No family data to render");
        return null;
      }

      // Create DAG from the data
      const dag = graphStratify()(this.familyData);

      console.log("DAG structure:", dag);

      // Layout configuration
      const nodeSize = [FIXED_NODE_SIZE, FIXED_NODE_SIZE];

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

      let viewBoxWidth = xExtent[1] - xExtent[0] + nodeSize[0];
      let viewBoxHeight = yExtent[1] - yExtent[0] + nodeSize[1];

      // Create SVG element using d3
      const svg = d3
        .create("svg")
        .attr("width", viewBoxWidth)
        .attr("height", viewBoxHeight)
        .style("display", "block") // Ensures the SVG doesn't have extra space below
        .style("max-width", "100%")
        .style("max-height", "600px") // Or any other max height you prefer
        .style("overflow", "auto"); // Enables scrolling

      // Log the viewport size
      console.log(`Viewport size: ${svg.attr("viewBox")}`);

      const g = svg.append("g");
      // .attr("transform", `translate(${margin.left},${margin.top})`);

      // Render box rect
      this.renderBoxRect(g, viewBoxWidth, viewBoxHeight);

      // Render links
      this.renderLinks(g, dag);

      // Render nodes
      this.renderNodes(g, dag);

      // console.log("svg:", svg);
      // console.log("g:", g);

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
      .attr("stroke", "gray")
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

    nodeGroup
      .append("circle")
      .attr("r", FIXED_CIRCLE_RADIUS)
      .attr("fill", "#99b362");

    nodeGroup
      .append("text")
      .text((d) => d.data.id)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("font-size", FIXED_FONT_SIZE)
      .attr("fill", "white");
  }

  renderSelect() {
    if (typeof window === "undefined") {
      // prevent rendering on the server
      return "";
    }
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
      <div class="family-tree-container">
        <div id="family-tree-placeholder"></div>
      </div>
    `;
  }
}

// Define the custom element
try {
  customElements.define("family-tree-viz", FamilyTreeVisualization);
} catch (error) {
  // Element already defined, or other error occurred
  console.warn("Couldn't define custom element:", error);
}
