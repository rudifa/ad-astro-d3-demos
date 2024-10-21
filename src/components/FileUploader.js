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
    isLoading: { type: Boolean },
  };

  constructor() {
    super();
    this.isLoading = false;
    console.log("FileProcessor: Constructor called");
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    this.isLoading = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.isLoading = false;

        // Dispatch an event with the parsed JSON data
        console.log("FileUploader: Dispatching file-uploaded event", jsonData);
        this.dispatchEvent(
          new CustomEvent("file-uploaded", {
            detail: { jsonData },
            bubbles: true,
            composed: true,
          }),
        );
        console.log("File uploaded successfully.");
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
      <sl-label for="file-input">Upload a JSON file:</sl-label>
      <input id="file-input" type="file" @change=${this.handleFileUpload} />
      ${this.isLoading ? html`<sl-spinner></sl-spinner>` : ""}
    `;
  }
}

customElements.define("file-uploader", FileUploader);
