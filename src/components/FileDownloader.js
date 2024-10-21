import { LitElement, html, css } from "lit";

export class FileDownloader extends LitElement {
  static properties = {
    processedData: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  constructor() {
    super();
    this.processedData = null;
    console.log("FileDownloader: Constructor called");
  }

  downloadFile() {
    if (this.processedData) {
      const dataStr = JSON.stringify(this.processedData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", "processed_data.json");
      linkElement.click();
    }
  }

  render() {
    return html`
      <sl-button @click=${this.downloadFile} ?disabled=${!this.processedData}>
        Download Processed Data
      </sl-button>
    `;
  }
}

customElements.define("file-downloader", FileDownloader);
