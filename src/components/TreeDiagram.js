import * as d3 from "d3";
import { html, css, LitElement } from "lit";

export class TreeDiagram extends LitElement {
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

  firstUpdated() {
    const data = {
      name: "Root",
      children: [
        {
          name: "Child 1",
          children: [{ name: "Grandchild 1" }, { name: "Grandchild 2" }],
        },
        {
          name: "Child 2",
          children: [{ name: "Grandchild 3" }],
        },
      ],
    };

    const width = this.clientWidth;
    const height = this.clientHeight;
    const horiz_padding = 40; // Define horizontal padding

    const svg = d3
      .select(this.shadowRoot.querySelector("#tree"))
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${horiz_padding},0)`); // Use horizontal padding for translation

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width - 2 * horiz_padding]); // Use horizontal padding to limit the width

    treeLayout(root);

    svg
      .selectAll(".link")
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

    const nodes = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes.append("circle").attr("r", 5);

    nodes
      .append("text")
      .attr("dy", -10) // Move text above the node circle
      .attr("x", (d) => (d.depth === 0 ? -5 : 5)) // Align text horizontally to within the circle extents
      .style("text-anchor", (d) => (d.depth === 0 ? "start" : "end"))
      .text((d) => d.data.name);
  }

  render() {
    return html`<svg id="tree"></svg>`;
  }
}

customElements.define("tree-diagram", TreeDiagram);
