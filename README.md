# Astro + Lit Demo

## FamilyTreeVisualization

`FamilyTreeVisualization.js` is a Lit component that renders a family tree visualization using d3 and d3dag.

It provides a Lit component `customElements.define("family-tree-viz", FamilyTreeVisualization);`.

Investigation lines:

- what is the best way of importing and instantiating the component in an Astro page?

Development lines:

- revise the input data format; make it same as that of TreeDiagram?

- add dynamic changes of input data - like in TreeDiagram?

- ✅ selectable graph orientation

- selectable node shapes / presentations

- interactive nodes like in js_family_tree? - uses a local copy of d3dag

- add a private input data file, encrypted, open with a password.

## Files

```
ad-astro-d3-demos % tree -f src                                                                                                                                  [:bb91b02 L|✔]
src
├── src/components
│   ├── src/components/CardGrid.astro
│   ├── src/components/FamilyTreeVisualization.js
│   ├── src/components/FileDownloader.js
│   ├── src/components/FileProcessor.js
│   ├── src/components/FileUploader.js
│   ├── src/components/MyComponent.js
│   ├── src/components/MyElement.js
│   ├── src/components/ProcFuncs.js
│   ├── src/components/ThemeSelector.astro
│   └── src/components/TreeDiagram.js
├── src/data
│   ├── src/data/family.json
│   ├── src/data/one-child.json
│   └── src/data/two-children-unrelated.json
├── src/html
├── src/layouts
│   ├── src/layouts/BaseLayout.astro
│   └── src/layouts/ShoelaceLayout.astro
├── src/pages
│   ├── src/pages/FamilyTreeVisualization.astro
│   ├── src/pages/fileprocessor.astro
│   ├── src/pages/index.astro
│   ├── src/pages/mycomponent.astro
│   ├── src/pages/treediagram.astro
│   └── src/pages/webapp.astro
├── src/styles
│   ├── src/styles/Base.css
│   ├── src/styles/Content.css
│   └── src/styles/Globals.css
├── src/util
│   ├── src/util/.DS_Store
│   ├── src/util/d3-hierarchy-to-svg.demo.js
│   ├── src/util/json-to-d3-hierarchy.demo.js
│   ├── src/util/json-to-d3-hierarchy.js
│   ├── src/util/json-to-d3-hierarchy.test.js
│   ├── src/util/lit-to-svg.demo.js
│   ├── src/util/multiarchy-chatgpt.demo.js
│   ├── src/util/multiarchy-chatgpt.js
│   ├── src/util/multiarchy-chatgpt.test.js
│   ├── src/util/multiarchyVisualizer.demo.js
│   ├── src/util/multiarchyVisualizer.js
│   └── src/util/readJsonFile.js
├── src/.DS_Store
└── src/env.d.ts

```

## Project origin

This project demonstrates how to integrate Lit components with Astro, based on the Astro Starter Kit: Minimal template.

## 🚀 Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   └── MyComponent.js
│   └── pages/
│   │   ├── index.astro
│   │   └── mycomponent.astro
├── astro.config.mjs
└── package.json
```

- `src/pages/`: Contains Astro pages
- `src/components/`: Houses Lit components
- `public/`: Stores static assets

## 🧞 Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm install`       | Installs dependencies                            |
| `npm run dev`       | Starts local dev server at `localhost:4321`      |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run preview`   | Preview your build locally, before deploying     |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🚀 Getting Started

1. Clone this repository or create a new Astro project
2. Run `npm install`
3. Start the dev server with `npm run dev`

## 📚 Adding Lit Components to Astro

> unless already added:

1. Install the @astrojs/lit integration:

   ```sh
   npm install @astrojs/lit lit
   ```

2. Configure Astro to use Lit in `astro.config.mjs`:

   ```javascript
   import { defineConfig } from "astro/config";
   import lit from "@astrojs/lit";

   export default defineConfig({
     integrations: [lit()],
   });
   ```

3. Create a Lit component in `src/components/`:

   ```javascript
   import { LitElement, html } from "lit";

   export class MyComponent extends LitElement {
     render() {
       return html`<p>Hello from Lit!</p>`;
     }
   }

   customElements.define("my-component", MyComponent);
   ```

4. Use the Lit component in an Astro page:

   ```astro
   ---
   import { MyComponent } from "../components/MyComponent";
   ---

   <MyComponent client:only="lit" />
   <!-- using the client: directive to load an interactive component client-side -->
   ```

## 🔑 Key Integration Points

1. **Component Definition**: `export` a class that extends `LitElement` and use `customElements.define()`.
2. **Page Import**: Use named import like `import { MyComponent } from...` and use proper component path.
3. **Astro Usage**: Use PascalCase for component names and apply client directives.
4. **Shadow DOM**: Lit components use Shadow DOM by default.
5. **Reactivity**: Use `static properties` for reactive properties in Lit components.
6. **Styling**: Define styles using `static styles` for component-scoped CSS.

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Lit Documentation](https://lit.dev/)
- [@astrojs/lit Integration Guide](https://docs.astro.build/en/guides/integrations-guide/lit/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [MIT](LICENSE) licensed.
