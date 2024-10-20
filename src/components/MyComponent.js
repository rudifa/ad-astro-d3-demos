// src/components/MyComponent.js
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      background-color: #f0f0f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    button {
      background-color: #4caf50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
    p#counter {
      font-size: 18px;
    }
  `;

  static properties = {
    count: { type: Number },
  };

  constructor() {
    super();
    this.count = 0;
    console.log("MyComponent constructor");
  }

  render() {
    return html`
      <div class="card">
        <h2>Hello from Lit!</h2>
        <p>This is a Lit component integrated into an Astro page.</p>
        <p id="counter">Count: ${this.count}</p>
        <button @click=${this._incrementCount}>Increment</button>
      </div>
    `;
  }

  _incrementCount() {
    this.count++;
  }
}

customElements.define('my-component', MyComponent);
