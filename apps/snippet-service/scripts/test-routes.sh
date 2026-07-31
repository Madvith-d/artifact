#!/usr/bin/env bash
# Quick manual test of all snippet routes using curl
# Prerequisites: server running on localhost:3003, seed data loaded
set -euo pipefail

BASE="http://localhost:3003/snippet"
CURL="curl -s --max-time 5"

JWT_SECRET="rwgfwgwegegerhgergsrg"

ALICE_ID="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
BOB_ID="b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"

echo "=== Generating JWTs ==="
ALICE_JWT=$(bun -e "
  const jwt = require('jsonwebtoken');
  console.log(jwt.sign({ id: '$ALICE_ID', email: 'alice@example.com' }, '$JWT_SECRET', { expiresIn: '1h' }));
")
BOB_JWT=$(bun -e "
  const jwt = require('jsonwebtoken');
  console.log(jwt.sign({ id: '$BOB_ID', email: 'bob@example.com' }, '$JWT_SECRET', { expiresIn: '1h' }));
")
echo "Alice JWT: $ALICE_JWT"
echo ""

echo "=== 1. CREATE snippet (POST /snippet) ==="
$CURL -X POST "$BASE" \
  -H "Authorization: Bearer $ALICE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Snippet from Curl",
    "description": "Created via test script",
    "language": "javascript",
    "code": "console.log(\"hello from test\");",
    "visibility": "public"
  }' | jq .
echo ""

echo "=== 2. GET own snippets (GET /snippet?page=1&limit=10) ==="
$CURL -X GET "$BASE?page=1&limit=10" \
  -H "Authorization: Bearer $ALICE_JWT" | jq .
echo ""

echo "=== 3. GET public snippets for Alice (GET /snippet/public/$ALICE_ID) ==="
$CURL -X GET "$BASE/public/$ALICE_ID?page=1&limit=10" | jq .
echo ""

echo "=== 4. UPDATE snippet (PATCH /snippet/:id) ==="
SNIPPET_ID="11111111-1111-4111-8111-111111111111"
$CURL -X PATCH "$BASE/$SNIPPET_ID" \
  -H "Authorization: Bearer $ALICE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$SNIPPET_ID'",
    "title": "Hello World TypeScript (updated via curl)",
    "description": "Updated description from curl test",
    "language": "typescript",
    "code": "console.log(\"Hello, Updated World!\");",
    "visibility": "public"
  }' | jq .
echo ""

echo "=== 5. DELETE snippet (DELETE /snippet/:id) ==="
DELETE_ID="55555555-5555-4555-8555-555555555555"
$CURL -X DELETE "$BASE/$DELETE_ID" \
  -H "Authorization: Bearer $ALICE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$DELETE_ID'"
  }' | jq .
echo ""

echo "=== 6. ERROR: 401 without auth ==="
$CURL -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -d '{"title":"x","description":"","language":"python","code":"x","visibility":"private"}' | jq .
echo ""

echo "=== 7. ERROR: 400 with invalid body ==="
$CURL -X POST "$BASE" \
  -H "Authorization: Bearer $ALICE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"title":"incomplete"}' | jq .
echo ""

echo "Done!"
