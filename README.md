Prerequisites

Install:

- Bun
- Docker with the Docker daemon running
- curl for testing
- Optional: jq for parsing responses

1.  Install dependencies

From the repository root:

```bash
  bun install
```

2.  Create service environment files

```bash
  cp apps/gateway/.env.example apps/gateway/.env
  cp apps/identity-service/.env.example apps/identity-service/.env
  cp apps/snippet-service/.env.example apps/snippet-service/.env
  cp apps/execution-service/.env.example apps/execution-service/.env
  cp apps/runner-service/.env.example apps/runner-service/.env
```

Make sure these values match across services:

```env
  JWT_SECRET=your_super_secret_jwt_key_here
```

And make sure this value matches between Execution and Runner:

```env
  RUNNER_CALLBACK_TOKEN=replace_with_a_long_random_secret
```

3.  Start PostgreSQL and RabbitMQ

From the repository root:

```bash
  docker compose -f apps/identity-service/docker-compose.yml up -d
  docker compose -f apps/snippet-service/docker-compose.yml up -d
  docker compose up -d --wait rabbitmq execution-db
```

This starts:

┌──────────────────────────────┬───────┐
│ Infrastructure │ Port │
├──────────────────────────────┼───────┤
│ Identity PostgreSQL │ 5432 │
├──────────────────────────────┼───────┤
│ Snippet PostgreSQL │ 5433 │
├──────────────────────────────┼───────┤
│ Execution PostgreSQL │ 5434 │
├──────────────────────────────┼───────┤
│ RabbitMQ │ 5672 │
├──────────────────────────────┼───────┤
│ RabbitMQ dashboard │ 15672 │
└──────────────────────────────┴───────┘

RabbitMQ dashboard credentials are guest / guest.

Give the Identity and Snippet databases a few seconds to initialize:

```bash
  sleep 5
```

4.  Apply database migrations

```bash
  (
    cd apps/identity-service
    bunx drizzle-kit migrate
  )

  (
    cd apps/snippet-service
    bunx drizzle-kit migrate
  )

  (
    cd apps/execution-service
    bun run db:migrate
  )
```

5.  Start the services

Open five terminals from the repository root.

### Terminal 1 — Identity Service

```bash
  cd apps/identity-service
  bun run dev
```

Runs on http://localhost:3001.

### Terminal 2 — Snippet Service

```bash
  cd apps/snippet-service
  bun run dev
```

Runs on http://localhost:3003.

### Terminal 3 — Execution Service

```bash
  cd apps/execution-service
  bun run dev
```

Runs on http://localhost:3004.

### Terminal 4 — Runner Service

```bash
  cd apps/runner-service
  bun run dev
```

Runs on http://localhost:3005.

The first startup may pull the python:3.12-alpine Docker image.

### Terminal 5 — Gateway

```bash
  cd apps/gateway
  bun run dev
```

Runs on http://localhost:3000.

6.  Check health endpoints

```bash
  curl http://localhost:3000/health
  curl http://localhost:3001/health
  curl http://localhost:3003/health
  curl http://localhost:3004/health
  curl http://localhost:3005/health
```

7.  Test the complete execution flow

### Register

```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H 'Content-Type: application/json' \
    -d '{
      "username": "alice",
      "email": "alice@example.com",
      "password": "password123"
    }'
```

### Log in and capture the JWT

With jq installed:

```bash
  TOKEN=$(
    curl -s -X POST http://localhost:3000/api/auth/login \
      -H 'Content-Type: application/json' \
      -d '{
        "email": "alice@example.com",
        "password": "password123"
      }' |
    jq -r '.data.token'
  )
```

Verify it:

```bash
  echo "$TOKEN"
```

### Create a Python snippet

```bash
  SNIPPET_ID=$(
    curl -s -X POST http://localhost:3000/api/snippet \
      -H "Authorization: Bearer $TOKEN" \
      -H 'Content-Type: application/json' \
      -d '{
        "title": "Hello Python",
        "description": "Local execution test",
        "language": "python",
        "code": "print(\"Hello from Docker\")",
        "visibility": "private"
      }' |
    jq -r '.snippet.id'
  )
```

### Queue the execution

```bash
  JOB_ID=$(
    curl -s -X POST http://localhost:3000/api/execute \
      -H "Authorization: Bearer $TOKEN" \
      -H 'Content-Type: application/json' \
      -d "{\"snippetId\":\"$SNIPPET_ID\"}" |
    tee /dev/stderr |
    jq -r '.jobId'
  )
```

Expected initial response:

```json
{
  "success": true,
  "jobId": "...",
  "status": "queued"
}
```

### Fetch the result

```bash
  curl http://localhost:3000/api/execute/$JOB_ID \
    -H "Authorization: Bearer $TOKEN"
```

After the runner completes, the response should resemble:

```json
{
  "jobId": "...",
  "snippetId": "...",
  "language": "python",
  "status": "completed",
  "stdout": "Hello from Docker\n",
  "stderr": "",
  "exitCode": 0
}
```

Stop everything

Stop the service processes with Ctrl+C, then remove infrastructure containers:

```bash
  docker compose down
  docker compose -f apps/identity-service/docker-compose.yml down
  docker compose -f apps/snippet-service/docker-compose.yml down
```

To also delete all local database data:

```bash
  docker compose down -v
  docker compose -f apps/identity-service/docker-compose.yml down -v
  docker compose -f apps/snippet-service/docker-compose.yml down -v
```
