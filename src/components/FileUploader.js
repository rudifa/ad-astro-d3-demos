import { html, css, LitElement } from 'lit';

export class FileUploader extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
    input[type="file"] {
      display: none; /* Hide the default file input */
    }
    .custom-file-input {
      display: inline-block;
      padding: 8px 16px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      text-align: center;
    }
  `;

  static properties = {
    isLoading: { type: Boolean },
    selectedFileName: { type: String }, // Add selectedFileName property
  };

  constructor() {
    super();
    this.isLoading = false;
    this.selectedFileName = ""; // Initialize selectedFileName
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    this.selectedFileName = file.name; // Set the selected file name
    this.isLoading = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.isLoading = false;

        // Dispatch an event with the parsed JSON data
        console.log("FileUploader: received file, dispatch file-uploaded event", jsonData);
        this.dispatchEvent(
          new CustomEvent("file-uploaded", {
            detail: { jsonData },
            bubbles: true,
            composed: true,
          }),
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
      <label class="custom-file-input">
        Choose file to upload
        <input id="file-input" type="file" @change=${this.handleFileUpload} />
      </label>
      ${this.isLoading ? html`<sl-spinner></sl-spinner>` : ""}
      ${this.selectedFileName
        ? html`<p>File: ${this.selectedFileName}</p>`
        : ""}
    `;
  }
}

customElements.define('file-uploader', FileUploader);
