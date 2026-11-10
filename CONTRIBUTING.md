# How to contribute

Please send a GitHub Pull Request or open an issue.

## Development

Use Node.js 22.12 or newer, then run:

```sh
npm ci
npm test
```

`npm test` compiles with strict TypeScript checking and runs integration tests in
both the minimum supported VS Code version and current Stable. To run only one host:

```sh
npm test -- --label minimum
npm test -- --label stable
```

## Compatibility and dependency updates

- `engines.vscode` in `package.json` is the installation minimum, not the version
  used to build the extension. Keep `@types/vscode` pinned to that exact minimum
  so compilation rejects newer APIs. The minimum test host is derived from the
  manifest in `.vscode-test.mjs`.
- VS Code supplies the Node.js runtime and Markdown-it parser. Build-time Node.js
  can be newer, but emitted JavaScript and runtime dependencies must work in the
  oldest supported extension host. Node.js typings stay on 20.x to match VS Code
  1.95's runtime; the compiler targets ES2022. The `Node20` module mode resolves
  Markdown-it's mixed CommonJS/ES module declarations while still emitting
  CommonJS for this project. Runtime imports must remain compatible with the
  minimum host; this setting does not upgrade its Node.js runtime.
- Only the two Markdown-it plugins are shipped as runtime dependencies.
  Markdown-it itself is a development dependency for rendering tests. Version 15
  includes its own types: use its named `MarkdownIt` type for parser instances
  and its default export for construction. Local plugin declarations in `src`
  reuse those types because the existing DefinitelyTyped container declarations
  target the older API.
- The build uses TypeScript 7 directly. ESLint and the TypeScript 6 API
  compatibility package are no longer needed; strict compilation and integration
  tests are the project's validation baseline.
- Update compatible dependencies and the lockfile together, then run `npm test`
  and `npx vsce package`. Do not raise the VS Code minimum just to update build
  tools. Raising the minimum intentionally drops older clients and should be
  documented in the changelog before publishing a new extension version.
