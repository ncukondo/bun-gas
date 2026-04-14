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

## Non-interactive setup (for CI / AI agents)

`bun run init` is normally interactive, but it also accepts flags and environment
variables so it can run in non-TTY environments. Login to clasp must be done
once by a human in an interactive terminal (`bunx clasp login`); after that,
`init` can be driven non-interactively.

Flags (with `bun run init`):

```bash
bun run init -- --name my-project --type standalone
bun run init -- --script-id <existing-apps-script-id>
bun run init -- --no-create          # scaffold only, create project later
```

`--type` accepts: `standalone`, `sheets`, `docs`, `forms`, `slides`, `webapp`,
`api`, `no`.

Environment variables (useful with `bun create`, since flags are not forwarded
to the postinstall script):

```bash
BUN_GAS_PROJECT_NAME=my-project \
BUN_GAS_PROJECT_TYPE=standalone \
  bun create ncukondo/bun-gas my-project
```

- `BUN_GAS_PROJECT_NAME` — same as `--name`
- `BUN_GAS_PROJECT_TYPE` — same as `--type`
- `BUN_GAS_SCRIPT_ID` — same as `--script-id`

In non-TTY environments, if clasp is not logged in, `init` exits with a message
asking you to run `bunx clasp login` first rather than hanging on a prompt.
