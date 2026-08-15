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
// console.log("d3dag available:", !!graphStratify);

// Custom function to create a Bézier curve path
function createBezierPath(source, target) {
  const midY = (source.y + target.y) / 2;
  return `M${source.x},${source.y}
              C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`;
}

const FIXED_NODE_SIZE = 150; // pixels
const FIXED_CIRCLE_RADIUS = 40; // pixels
const FIXED_FONT_SIZE = "12px"; // pixels

/**
 * A Lit component to visualize a family tree using d3-dag methods.
 *
 * Input data format: array of objects representing family members, each with properties:
 * [
 *  { id: "Alice", parentIds: [ "Bob", "Carol"] },
 *  //...
 *  //...
 * ]
 * where parentIds array may be empty for individuals without parents;
 * other properties (e.g., age, gender) are optional.
 */

export class FamilyTreeVisualization extends LitElement {
  static properties = {
    familyData: {
      type: Array,
      attribute: "family-data",
      reflect: true,
    },
    orientation: { type: String },
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
      /* overflow: auto; */
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
    this._familyData = this.getDefaultFamilyData();
    this.orientation = "top"; // Can be 'top', 'bottom', 'left', or 'right'
    this.testProp = "Initial value of testProp";
  }

  get familyData() {
    return this._familyData;
  }

  set familyData(value) {
    if (Array.isArray(value) && value.length === 0) {
      this._familyData = this.getDefaultFamilyData();
    } else {
      this._familyData = value;
    }
  }

  getDefaultFamilyData() {
    return [
      { id: "Grandpa", parentIds: [], age: 70, occupation: "Retired" },
      { id: "Grandma", parentIds: [] },
      {
        id: "Parent1",
        parentIds: ["Grandpa", "Grandma"],
        age: 45,
        occupation: "Engineer",
      },
      { id: "Parent2", parentIds: ["Grandpa", "Grandma"] },
      { id: "Child1", parentIds: ["Parent1"], age: 20, occupation: "Student" },
      { id: "Child2", parentIds: ["Parent2"] },
    ];
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
    if (!this.familyData || this.familyData.length === 0) {
      this.familyData = this.getDefaultFamilyData();
    }
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
      if (!this.familyData || this.familyData.length === 0) {
        console.warn("No family data to render");
        return null;
      }

      // Create DAG from the data
      const dag = graphStratify()(this.familyData);

      console.log("DAG structure:", dag);

      // Convert nodes and links to arrays
      const nodesArray = Array.from(dag.nodes());
      const linksArray = Array.from(dag.links());

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

      console.log("Nodes array:", nodesArray);
      console.log("Links array:", linksArray);
      console.log("Width:", width);
      console.log("Height:", height);

      // Adjust node positions based on orientation
      this.adjustNodePositions(nodesArray, width, height);

      // Recalculate width and height after adjusting positions
      const xExtent = d3.extent(nodesArray, (node) => node.x);
      const yExtent = d3.extent(nodesArray, (node) => node.y);

      let viewBoxWidth = xExtent[1] - xExtent[0] + nodeSize[0];
      let viewBoxHeight = yExtent[1] - yExtent[0] + nodeSize[1];

      // Create SVG element using d3
      const minWidth = 900; // Minimum width in pixels
      let svgWidth, svgHeight;

      if (this.orientation === "left" || this.orientation === "right") {
        // Swap width and height for left and right orientations
        svgWidth = Math.max(height, minWidth);
        svgHeight = width;
      } else {
        svgWidth = Math.max(width, minWidth);
        svgHeight = height;
      }

      const svg = d3
        .create("svg")
        .attr("viewBox", [0, 0, svgWidth, svgHeight])
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      console.log(`Viewport size: ${svg.attr("viewBox")}`);

      const g = svg.append("g");

      // Render box rect
      this.renderBoxRect(g, viewBoxWidth, viewBoxHeight);

      // Render links
      this.renderLinks(g, linksArray);

      // Render nodes
      this.renderNodes(g, nodesArray);

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
    // Calculate the center of the graph
    let centerX = width / 2;
    let centerY = height / 2;

    // Apply rotations
    nodes.forEach((node) => {
      let cx = centerX;
      let cy = centerY;

      // Translate to origin
      let x = node.x - cx;
      let y = node.y - cy;

      switch (this.orientation) {
        case "right":
          [x, y] = [y, -x];
          [cx, cy] = [cy, cx];
          break;
        case "bottom":
          [x, y] = [-x, -y];
          break;
        case "left":
          [x, y] = [-y, x];
          [cx, cy] = [cy, cx];
          break;
        case "top":
        default:
          // No change for top orientation
          break;
      }

      // Translate back
      node.x = x + cx;
      node.y = y + cy;
    });
  }

  renderLinks(g, linksArray) {
    g.append("g")
      .selectAll("path")
      .data(linksArray)
      .enter()
      .append("path")
      .attr("d", ({ source, target }) => createBezierPath(source, target))
      .attr("fill", "none")
      .attr("stroke", "#f19600")
      .attr("stroke-width", 2);
  }

  renderNodes(g, nodesArray) {
    const nodeGroup = g
      .append("g")
      .selectAll("g")
      .data(nodesArray)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodeGroup
      .append("circle")
      .attr("r", FIXED_CIRCLE_RADIUS)
      .attr("fill", "#99b362");

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", FIXED_FONT_SIZE)
      .attr("fill", "white")
      .each(function (d) {
        const text = d3.select(this);
        text.append("tspan").attr("x", 0).attr("dy", "-0.2em").text(d.data.id);

        if (d.data.age !== undefined || d.data.occupation !== undefined) {
          let infoText = "(";
          if (d.data.age !== undefined) {
            infoText += d.data.age;
          }
          if (d.data.age !== undefined && d.data.occupation !== undefined) {
            infoText += ", ";
          }
          if (d.data.occupation !== undefined) {
            infoText += d.data.occupation;
          }
          infoText += ")";

          text.append("tspan").attr("x", 0).attr("dy", "1.2em").text(infoText);
        }
      });
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
