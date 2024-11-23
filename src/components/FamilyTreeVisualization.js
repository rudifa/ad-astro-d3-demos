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
      converter: {
        fromAttribute: (value) => {
          try {
            return JSON.parse(value);
          } catch (error) {
            console.error("Invalid family data JSON", error);
            return [];
          }
        },
      },
    },
    width: { type: Number, attribute: true },
    height: { type: Number, attribute: true },
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
    this.testProp = "Initial value of testProp";
    console.log("Constructor called");
  }

  firstUpdated() {
    console.log("First updated");

    this.renderFamilyTree();
  }

  updated(changedProperties) {
    console.log("Updated", changedProperties);

    if (changedProperties.has("familyData")) {
      // Clear previous SVG and re-render
      const svgContainer = this.renderRoot.querySelector("#family-tree-svg");
      if (svgContainer) {
        svgContainer.innerHTML = "";
        this.renderFamilyTree();
      }
    }
  }

  connectedCallback() {
    console.log("Connected callback");
    super.connectedCallback();
    this.updateComplete.then(() => {
      console.log("Update complete");
      this.renderFamilyTree();
    });
    this.resizeObserver = new ResizeObserver(() => this.renderFamilyTree());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
  }
  renderFamilyTree() {
    try {
      console.log("Rendering family tree called");
      console.log("Family data:", this.familyData);

      if (!this.familyData || this.familyData.length === 0) {
        console.warn("No family data to render");
        return;
      }

      const svgContainer = this.renderRoot.querySelector("#family-tree-svg");
      svgContainer.innerHTML = ""; // Clear previous content

      // Create DAG from the data
      const dag = graphStratify()(this.familyData);

      console.log("DAG structure:", dag);

      // Layout configuration
      const margin = { top: 40, right: 40, bottom: 40, left: 40 };

      // Create SVG
      const svg = d3
        .select(svgContainer)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

      // Sugiyama layout (specialized for DAGs)
      const layout = sugiyama()
        .nodeSize([120, 80])
        .layering(layeringLongestPath())
        .decross(decrossTwoLayer())
        .coord(coordCenter());

      // Apply layout
      const { width, height } = layout(dag);

      // Adjust SVG viewBox based on the layout result
      svg.attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
      );

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .selectAll("path")
        .data(dag.links())
        .enter()
        .append("path")
        .attr("d", ({ source, target }) => createBezierPath(source, target))
        .attr("fill", "none")
        .attr("stroke", "#2196F3") // Change color
        .attr("stroke-width", 2); // Increase width

      // Draw nodes
      const nodes = g
        .append("g")
        .selectAll("g")
        .data(dag.nodes())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      nodes.append("circle").attr("r", 20).attr("fill", "#69b3a2");

      nodes
        .append("text")
        .attr("dy", "0.32em")
        .attr("text-anchor", "middle")
        .text((d) => d.data.id)
        .attr("font-size", "10px")
        .attr("fill", "white");

      // Add this debugging code
      console.log("Number of nodes:", dag.nodes().length);
      console.log("Number of links:", dag.links().length);
      console.log("SVG dimensions:", width, height);
    } catch (error) {
      console.error("Error rendering family tree:", error);
    }
  }

  render() {
    console.log("Render called");
    return html`
      <div id="family-tree-svg"></div>
      <p>Test prop: ${this.testProp}</p>
      <button @click=${this.testMethod}>Test Button</button>
    `;
  }
}

// Define the custom element
customElements.define("family-tree-viz", FamilyTreeVisualization);
