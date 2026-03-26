# Development guide

## Avaliable commands

```sh
# Lint and typecheck
bun lint

# Format code
bun format

# Run tests
bun run test

# Do all at once
bun u
```

## Instructions

Never edit test snapshots manually. Use `bun run test -u` instead

```sh
# Run tests and update snaphots
bun run test -u
```
