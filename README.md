# bun-gas

This is a simple template for a bun project for google apps script.

To use this template:

```bash
bun create ncukondo/bun-gas my-project
cd my-project
```

To build:

```bash
bun run build
```

To push:

```bash
bun run push
```

To deploy:

```bash
bun run deploy
```

Default entry file is `src/index.js`. You can change this in `package.json`.
All exported functions and variables in this file will be exposed as a google apps script function and variables.
