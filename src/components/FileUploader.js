import { html, css, LitElement } from "lit";

export class FileUploader extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
    .file-content {
      white-space: pre-wrap;
      background: #f4f4f4;
      padding: 16px;
      border: 1px solid #ddd;
      margin-top: 16px;
    }
  `;

  static properties = {
    fileContent: { type: String },
    isLoading: { type: Boolean },
  };

  constructor() {
    super();
    this.fileContent = "";
    console.log("FileUploader: Constructor called");
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();
    this.isLoading = true;
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.fileContent = JSON.stringify(jsonData, null, 2);
        this.isLoading = false;

        // Dispatch an event with the parsed JSON data
        console.log("FileUploader: Dispatching file-uploaded event", jsonData);
        this.dispatchEvent(
          new CustomEvent("file-uploaded", {
            detail: { jsonData },
            bubbles: true,
            composed: true,
          }),
          console.log("File uploaded successfully."),
        );
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Error parsing JSON file.");
        this.isLoading = false;
      }
    };
    reader.readAsText(file);
  }

  render() {
    return html`
      <input type="file" @change=${this.handleFileUpload} />
      ${this.isLoading
        ? html`<p>Loading...</p>`
        : html`<div class="file-content">
            ${this.fileContent || "No file uploaded yet"}
          </div>`}
    `;
  }
}

customElements.define("file-uploader", FileUploader);
