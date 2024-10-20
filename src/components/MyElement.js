import { LitElement, html, css } from "lit";

export class MyElement extends LitElement {
  static styles = css`
    p {
      color: red;
    }
  `;

  // constructor
  constructor() {
    super();
    console.log("MyElement constructor");
  }

  render() {
    return html`<p>Hello world! From my-element</p>`;
  }
}

customElements.define("my-element", MyElement);
