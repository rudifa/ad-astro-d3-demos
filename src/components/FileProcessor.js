import { LitElement, html, css } from "lit";
import * as procFuncs2 from "./ProcFuncs.js"; // array of funcs exported from ProcFuncs.js
import * as procFuncs1 from "../util/json-to-d3-hierarchy.js"; // array of funcs exported from json-to-d3-hierarchy.js
// const procFuncs is a merge of procFuncs1 + procFuncs2
const procFuncs = { ...procFuncs1, ...procFuncs2 };

export class FileProcessor extends LitElement {
  static properties = {
    jsonData: { type: Object },
    processedData: { type: Object },
    selectedFunction: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  constructor() {
    super();
    this.jsonData = null;
    this.processedData = null;
    const availableFunctions = Object.keys(procFuncs);
    this.selectedFunction = availableFunctions.length > 0 ? availableFunctions[0] : null;
    console.log("FileProcessor: Constructor called, selected function:", this.selectedFunction);
  }

  set jsonData(value) {
    const oldValue = this._jsonData;
    this._jsonData = value;
    this.requestUpdate("jsonData", oldValue);
    console.log("FileProcessor: jsonData received", value);
  }

  get jsonData() {
    return this._jsonData;
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log("FileProcessor: Connected to the DOM");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  processData() {
    if (this.jsonData && this.selectedFunction) {
      console.log("FileProcessor: processing starts.");

      const processingFunction = procFuncs[this.selectedFunction];
      if (typeof processingFunction === 'function') {
        const processedData = processingFunction(this.jsonData);

        console.log(
          "FileProcessor: processing done, dispatch data-processed event.",
          processedData,
        );

        this.dispatchEvent(
          new CustomEvent("data-processed", {
            detail: { processedData },
            bubbles: true,
            composed: true,
          }),
        );
      } else {
        console.error(`Processing function ${this.selectedFunction} not found`);
      }
    }
  }

  render() {
    return html`
      <div>
        ${Object.keys(procFuncs).length > 0 ? html`
          <sl-select
            label="Select Processing Function"
            value=${this.selectedFunction}
            @sl-change=${this.handleFunctionChange}
          >
            ${Object.keys(procFuncs).map(funcName => html`
              <sl-option value=${funcName}>${funcName}</sl-option>
            `)}
          </sl-select>
        ` : html`
          <p>No processing functions available.</p>
        `}
      </div>
      <sl-button @click=${this.processData} ?disabled=${!this.jsonData || !this.selectedFunction}>
        Process Data
      </sl-button>
    `;
  }
  handleFunctionChange(event) {
    console.log("FileProcessor: Function changed to", event.target.value);
    this.selectedFunction = event.target.value;
    this.requestUpdate();
  }
}

customElements.define("file-processor", FileProcessor);
