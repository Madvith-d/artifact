# Runner Service

RabbitMQ worker for execution jobs. Python code runs in an ephemeral Docker container; code is never evaluated by the runner process itself.

Sandbox defaults:

- no network
- read-only root filesystem
- unprivileged user
- all Linux capabilities dropped
- `no-new-privileges`
- 128 MB memory, 0.5 CPU, 64 PIDs
- 5 second timeout
- 1 MiB stdout/stderr limits

## Run

Docker must be installed and the daemon must be reachable by the runner process.

```bash
cp .env.example .env
bun install
bun run dev
```

At startup the runner ensures that `python:3.12-alpine` (or `PYTHON_RUNNER_IMAGE`) is available before consuming jobs. `RUNNER_CALLBACK_TOKEN` must match the Execution service.
