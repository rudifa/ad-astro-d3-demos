import { LitElement, html, css } from "lit";

export class FileProcessor extends LitElement {
  static properties = {
    jsonData: { type: Object },
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
    console.log("FileProcessor: Constructor called");
  }

  set jsonData(value) {
    const oldValue = this._jsonData;
    this._jsonData = value;
    this.requestUpdate("jsonData", oldValue);
    console.log("FileProcessor: jsonData updated", value);
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
    if (this.jsonData) {
      console.log("File processing started.");
      // Here you can add any processing logic
      // Make keys uppercase
      const upperCaseKeys = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map((item) => upperCaseKeys(item));
        } else if (typeof obj === "object" && obj !== null) {
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key.toUpperCase(),
              upperCaseKeys(value),
            ]),
          );
        }
        return obj;
      };

      const processedData = upperCaseKeys(this.jsonData);

      console.log(
        "FileProcessor: Dispatching data-processed event",
        processedData,
      );

      this.dispatchEvent(
        new CustomEvent("data-processed", {
          detail: { processedData },
          bubbles: true,
          composed: true,
        }),
      );

      console.log("File processing done.");
    }
  }

  render() {
    return html`
      <sl-button @click=${this.processData} ?disabled=${!this.jsonData}>
        Process Data
      </sl-button>
    `;
  }
}

customElements.define("file-processor", FileProcessor);
