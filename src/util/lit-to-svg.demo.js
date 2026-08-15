#! /usr/bin/env node

import { LitElement, html } from "lit";

import { writeFile } from "fs/promises";

class MyLitComponent extends LitElement {
  render() {
    return html`
      <svg width="200" height="200">
        <circle cx="100" cy="100" r="80" fill="red" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white">
          Hello SVG
        </text>
      </svg>
    `;
  }
}

function litToSVG(LitComponentClass) {
  // Create an instance of the Lit component
  const component = new LitComponentClass();

  // Get the rendered template as a string
  const templateResult = component.render();

  // Convert TemplateResult to string
  let svgString = templateResult.strings.join("");

  // Basic validation to check if it's an SVG
  if (!svgString.includes("<svg")) {
    throw new Error("No SVG element found in the Lit component");
  }

  // Add XML declaration and SVG namespace
  svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
${svgString.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')}`;

  return svgString;
}

// Example usage
async function main() {
  try {
    const svgOutput = litToSVG(MyLitComponent);
    console.log(svgOutput);

    // Optionally, write to a file
    await writeFile("output.svg", svgOutput);
    console.log("SVG file has been saved: output.svg");
  } catch (error) {
    console.error("Error converting Lit component to SVG:", error);
  }
}

// Run the main function
main();
