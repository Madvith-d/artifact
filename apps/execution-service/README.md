# Execution Service

Authenticated asynchronous execution API. It reads snippets through the Snippet Service API, stores execution state in its own PostgreSQL database, and publishes durable jobs to RabbitMQ.

## API

- `POST /execute` — body: `{ "snippetId": "<uuid>" }`; returns `202` with a job ID.
- `GET /execute/:jobId` — returns the authenticated user's execution state and output.
- `PATCH /internal/executions/:jobId` — runner callback protected by `X-Runner-Token`.
- `GET /health` — liveness endpoint.

Only Python is accepted until another sandbox executor is implemented.

## Run

```bash
cp .env.example .env
bun install
docker compose up -d --wait rabbitmq execution-db
bun run db:migrate
bun run dev
```

`JWT_SECRET` must match the Identity and Snippet services. `RUNNER_CALLBACK_TOKEN` must match the Runner service.
