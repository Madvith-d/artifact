-- Seed data for snippet-service
-- Two users, each with a mix of public and private snippets

INSERT INTO users (id, username, email, password_hash, created_at, updated_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'alice', 'alice@example.com', '$2b$10$placeholder_hash_alice', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'bob', 'bob@example.com', '$2b$10$placeholder_hash_bob', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO snippets (id, title, description, language, code, visibility, owner_id, created_at, updated_at)
VALUES
  -- Alice's snippets
  (
    '11111111-1111-4111-8111-111111111111',
    'Hello World TypeScript',
    'A simple TypeScript hello world example',
    'typescript',
    'const greeting: string = "Hello, World!";\nconsole.log(greeting);',
    'public',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Fibonacci in Python',
    'Recursive Fibonacci implementation',
    'python',
    'def fib(n: int) -> int:\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)',
    'private',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Array Utilities',
    'Useful JavaScript array helpers',
    'javascript',
    'export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];\nexport const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);',
    'public',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'User Query',
    'SQL query to fetch active users',
    'sql',
    'SELECT u.id, u.username, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE u.active = true\nGROUP BY u.id\nORDER BY order_count DESC;',
    'private',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Landing Page',
    'A basic HTML landing page template',
    'html',
    '<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body>\n  <h1>Welcome</h1>\n  <p>Hello from my app!</p>\n</body>\n</html>',
    'public',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW(),
    NOW()
  ),

  -- Bob's snippets
  (
    '66666666-6666-4666-8666-666666666666',
    'Deploy Script',
    'Bash script for zero-downtime deployment',
    'bash',
    '#!/bin/bash\nset -euo pipefail\n\necho "Building..."\nnpm run build\necho "Deploying..."\nrsync -avz dist/ user@server:/app/\necho "Done!"',
    'public',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'Merge Sort C++',
    'Merge sort algorithm in C++',
    'c++',
    '#include <vector>\n\nvoid merge(std::vector<int>& arr, int l, int m, int r) {\n    // merge implementation\n}',
    'private',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    NOW() - INTERVAL '1 day',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
