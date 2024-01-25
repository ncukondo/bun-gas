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

Usage

```bash
bun run init             # initialize project

bun run build            # build project

bun run push             # push project to Google Apps Script using .clasp-dev.json
bun run push:prod        # push project to Google Apps Script using .clasp-prod.json

bun run deploy           # deploy project using .clasp-dev.json
bun run deploy:prod      # deploy project using .clasp-prod.json

bun run open             # open project in browser
bun run open:prod        # open project in browser(in .clasp-prod.json)

```

Default entry file is `src/index.js`. You can change this in `package.json`.
All exported functions and variables in this file will be exposed as a google apps script function and variables.
