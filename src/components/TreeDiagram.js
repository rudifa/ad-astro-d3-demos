import * as d3 from "d3";
import { html, css, LitElement } from "lit";

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (key === "parent" && typeof value === "object" && value !== null) {
      // Skip the 'parent' property to break the circular reference
      return "[Circular Parent]";
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
}

// usage:
// const jsonString = JSON.stringify(obj, getCircularReplacer());
// console.log(jsonString);

// Define enhanced stringifyCircular as a free function

function stringifyCircular(obj, maxDepth = 5, depth = 0, seen = new WeakSet()) {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);

  // Handle primitive types
  if (obj === null) return "null";
  if (typeof obj !== "object") return JSON.stringify(obj);

  // Check for circular references and max depth separately
  if (seen.has(obj)) {
    return '"[Circular Reference]"';
  }
  if (depth >= maxDepth) {
    return '"[Max Depth Reached]"';
  }

  seen.add(obj);

  // Handle arrays
  if (Array.isArray(obj)) {
    const items = obj.map(
      (item) =>
        childIndent + stringifyCircular(item, maxDepth, depth + 1, seen),
    );
    if (items.length === 0) return "[]";
    return `[\n${items.join(",\n")}\n${indent}]`;
  }

  // Handle d3.hierarchy Node
  if (obj.constructor.name === "Node") {
    const safe = {
      // Core data
      data: obj.data,
      height: obj.height,
      depth: obj.depth,

      // Layout coordinates (if they exist)
      ...(typeof obj.x !== "undefined" && { x: obj.x }),
      ...(typeof obj.y !== "undefined" && { y: obj.y }),

      // Children (for tree structure)
      children: obj.children,
    };

    obj = safe;
  }

  // Handle regular objects
  const entries = Object.entries(obj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const stringValue = stringifyCircular(value, maxDepth, depth + 1, seen);
      return `${childIndent}"${key}": ${stringValue}`;
    });

  if (entries.length === 0) return "{}";
  return `{\n${entries.join(",\n")}\n${indent}}`;
}

// Debug helper with optional title and collapsed groups
// function debugHierarchy(root, message = "Hierarchy Debug", collapsed = false) {
//   if (collapsed) {
//     console.groupCollapsed(message);
//   } else {
//     console.group(message);
//   }
//   console.log(stringifyCircular(root, 3));
//   console.groupEnd();
// }

// Example usage:
// debugHierarchy(root, "Initial hierarchy");
// debugHierarchy(root, "After layout", true);  // collapsed group

export class TreeDiagram extends LitElement {
  // Define the styles for the component
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    svg {
      width: 100%;
      height: 100%;
      border: 1px solid blue; /* Add blue border around the SVG area */
    }

    .link {
      fill: none;
      stroke: #555;
      stroke-opacity: 0.4;
      stroke-width: 1.5px;
    }

    .node circle {
      fill: #999;
      stroke: steelblue;
      stroke-width: 3px;
    }

    .node text {
      font: 12px sans-serif;
    }
  `;

  // Define the properties of the component
  static properties = {
    data: { type: Object },
  };

  constructor() {
    super();
    this.data = null;
  }

  // Lifecycle method: called when the element is added to the DOM
  connectedCallback() {
    super.connectedCallback();
    // Parse the data-json attribute if present
    const jsonString = this.getAttribute("data-json");
    if (jsonString) {
      this.data = JSON.parse(jsonString);
    }
    this.renderTree();
  }

  // Lifecycle method: called when an observed attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    console.log(
      `TreeDiagram.attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`,
    );

    // If the data-json attribute changes, update the data and re-render
    if (name === "data-json" && oldValue !== newValue) {
      this.data = JSON.parse(newValue);
      this.renderTree();
    }
  }

  // Lifecycle method: called after the component updates
  updated(changedProperties) {
    console.log("TreeDiagram.updated");
    super.updated(changedProperties);
    // If the data property changed, re-render the tree
    if (changedProperties.has("data")) {
      this.renderTree();
    }
  }

  // Method to render the tree diagram using D3.js
  renderTree() {
    console.log("TreeDiagram: renderTree called", this.data);

    // Select the SVG element and clear its contents
    const svg = d3.select(this.shadowRoot.querySelector("#tree"));
    svg.selectAll("*").remove(); // Clear existing content
    if (!this.data) {
      return;
    }

    // Set up dimensions and padding
    const width = this.clientWidth;
    const height = this.clientHeight;
    const horiz_padding = 40;

    // Create a group element to hold the tree
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${horiz_padding},0)`);

    // Create the hierarchical layout
    const root = d3.hierarchy(this.data);
    const treeLayout = d3.tree().size([height, width - 2 * horiz_padding]);

    // Log the hierarchy for debugging
    console.log("Tree Diagram: root 1", stringifyCircular(root, 5));
    console.log(
      "Tree Diagram: root 2",
      JSON.stringify(root, getCircularReplacer(), 2),
    );

    // Apply the tree layout to the root
    treeLayout(root);

    // Create the links (edges) of the tree
    g.selectAll(".link")
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
      );

    // Create node groups
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Add circles to represent nodes
    nodes.append("circle").attr("r", 5);

    // Add text labels for nodes
    nodes
      .append("text")
      .attr("dy", -10)
      .attr("x", (d) => (d.depth === 0 ? -5 : 5))
      .style("text-anchor", (d) => (d.depth === 0 ? "start" : "end"))
      .text((d) => d.data.name);
  }

  // Lit's render method: creates the initial empty SVG element
  render() {
    return html`<svg id="tree"></svg>`;
  }
}

// Register the custom element
customElements.define("tree-diagram", TreeDiagram);
