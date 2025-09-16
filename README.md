# Simple_Tower_defense_game

A simple tower defense game, just for fun.

## Development scripts

The repository provides a couple of helper scripts to standardise local quality checks:

- `scripts/lint.sh` – runs the project's `npm run lint` command.
- `scripts/test.sh` – executes the project's test suite via `npm test`.

Both scripts expect a valid `package.json` with the corresponding npm scripts defined and require a Node.js installation. These are the same commands executed by the continuous integration workflow.
